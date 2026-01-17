// utils/dbUtils.js
const sql = require('mssql');
const db = require('../config/database');

class DBUtils {
    // Test database connection
    async testConnection() {
        try {
            const connection = await db.getConnection();
            const result = await connection.request().query('SELECT 1 as test');
            return {
                connected: true,
                message: 'Database connection successful',
                data: result.recordset
            };
        } catch (error) {
            return {
                connected: false,
                message: 'Database connection failed',
                error: error.message
            };
        }
    }

    // Get database info
    async getDatabaseInfo() {
        try {
            const query = `
                SELECT 
                    DB_NAME() as database_name,
                    @@SERVERNAME as server_name,
                    @@VERSION as sql_version,
                    GETDATE() as server_time
            `;
            const result = await db.executeQuery(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Check if table exists
    async tableExists(tableName) {
        try {
            const query = `
                SELECT COUNT(*) as count 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = 'dbo' 
                AND TABLE_NAME = @tableName
            `;
            const params = [
                { name: 'tableName', type: sql.VarChar, value: tableName }
            ];
            const result = await db.executeQuery(query, params);
            return result[0].count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get table schema
    async getTableSchema(tableName) {
        try {
            const query = `
                SELECT 
                    COLUMN_NAME,
                    DATA_TYPE,
                    IS_NULLABLE,
                    CHARACTER_MAXIMUM_LENGTH
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = 'dbo' 
                AND TABLE_NAME = @tableName
                ORDER BY ORDINAL_POSITION
            `;
            const params = [
                { name: 'tableName', type: sql.VarChar, value: tableName }
            ];
            return await db.executeQuery(query, params);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DBUtils();