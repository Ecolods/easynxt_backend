const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        enableArithAbort: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

class Database {
    constructor() {
        this.pool = null;
    }

    async connect() {
        try {
            this.pool = await sql.connect(config);
            console.log('✅ Connected to SQL Server');
            return this.pool;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            throw error;
        }
    }

    async close() {
        try {
            if (this.pool) {
                await this.pool.close();
                console.log('📴 Database connection closed');
            }
        } catch (error) {
            console.error('❌ Error closing database:', error.message);
        }
    }

    async executeQuery(query, params = []) {
        try {
            const request = this.pool.request();
            
            // Add parameters to request
            params.forEach(param => {
                request.input(param.name, param.type, param.value);
            });
            
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('❌ Query execution failed:', error.message);
            throw error;
        }
    }

    async executeNonQuery(query, params = []) {
        try {
            const request = this.pool.request();
            
            // Add parameters to request
            params.forEach(param => {
                request.input(param.name, param.type, param.value);
            });
            
            const result = await request.query(query);
            return result.rowsAffected[0];
        } catch (error) {
            console.error('❌ Query execution failed:', error.message);
            throw error;
        }
    }
}

module.exports = new Database();