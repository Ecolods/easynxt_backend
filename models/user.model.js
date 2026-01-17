// const db = require('../config/database');
// const sql = require('mssql');

// class User {
//     constructor() {
//         this.tableName = 'dbo.users';
//     }

//     // Get all users
//     async getAllUsers(page = 1, limit = 10, filters = {}) {
//         try {
//             const offset = (page - 1) * limit;
//             let whereClause = '';
//             const params = [];
//             let paramIndex = 1;

//             // Build dynamic where clause
//             Object.keys(filters).forEach(key => {
//                 if (filters[key]) {
//                     whereClause += whereClause ? ' AND ' : ' WHERE ';
//                     whereClause += `${key} LIKE @param${paramIndex}`;
//                     params.push({
//                         name: `param${paramIndex}`,
//                         type: sql.VarChar,
//                         value: `%${filters[key]}%`
//                     });
//                     paramIndex++;
//                 }
//             });

//             const query = `
//                 SELECT * FROM ${this.tableName}
//                 ${whereClause}
//                 ORDER BY id DESC
//                 OFFSET @offset ROWS
//                 FETCH NEXT @limit ROWS ONLY;
//             `;

//             params.push(
//                 { name: 'offset', type: sql.Int, value: offset },
//                 { name: 'limit', type: sql.Int, value: limit }
//             );

//             const users = await db.executeQuery(query, params);

//             // Get total count
//             const countQuery = `
//                 SELECT COUNT(*) as total FROM ${this.tableName}
//                 ${whereClause}
//             `;
//             const countParams = params.filter(p => p.name !== 'offset' && p.name !== 'limit');
//             const countResult = await db.executeQuery(countQuery, countParams);

//             return {
//                 users,
//                 total: countResult[0].total,
//                 page,
//                 limit,
//                 totalPages: Math.ceil(countResult[0].total / limit)
//             };
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Get user by ID
//     async getUserById(id) {
//         try {
//             const query = `
//                 SELECT * FROM ${this.tableName} 
//                 WHERE id = @id
//             `;
//             const params = [
//                 { name: 'id', type: sql.Int, value: id }
//             ];
//             const result = await db.executeQuery(query, params);
//             return result[0] || null;
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Get user by email
//     async getUserByEmail(email) {
//         try {
//             const query = `
//                 SELECT * FROM ${this.tableName} 
//                 WHERE email = @email
//             `;
//             const params = [
//                 { name: 'email', type: sql.VarChar, value: email }
//             ];
//             const result = await db.executeQuery(query, params);
//             return result[0] || null;
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Create new user
//     async createUser(userData) {
//         try {
//             const query = `
//                 INSERT INTO ${this.tableName} (
//                     fullname, password, email, phone, address, city, pincode,
//                     role, profile_image, company_id, branch, last_login_ip,
//                     last_login, last_logout, lock_screen, lock_url, created_by,
//                     created_on, modified_by, modified_on, disabled_by, disabled_on,
//                     modules, submodules, uniquecode, access_login, username,
//                     gender, frgt_pwd_auth, appl_scanning, ref_by_name, ref_by_phone,
//                     dl_no, pancard_no, aadhar_no, voter_id, monthly_ctc,
//                     special_rights, client_id, parent_office, approved, child_modules
//                 ) VALUES (
//                     @fullname, @password, @email, @phone, @address, @city, @pincode,
//                     @role, @profile_image, @company_id, @branch, @last_login_ip,
//                     @last_login, @last_logout, @lock_screen, @lock_url, @created_by,
//                     GETDATE(), @modified_by, GETDATE(), @disabled_by, @disabled_on,
//                     @modules, @submodules, @uniquecode, @access_login, @username,
//                     @gender, @frgt_pwd_auth, @appl_scanning, @ref_by_name, @ref_by_phone,
//                     @dl_no, @pancard_no, @aadhar_no, @voter_id, @monthly_ctc,
//                     @special_rights, @client_id, @parent_office, @approved, @child_modules
//                 );
//                 SELECT SCOPE_IDENTITY() as id;
//             `;

//             const params = [
//                 { name: 'fullname', type: sql.VarChar(50), value: userData.fullname },
//                 { name: 'password', type: sql.VarChar(50), value: userData.password },
//                 { name: 'email', type: sql.VarChar(50), value: userData.email },
//                 { name: 'phone', type: sql.VarChar(50), value: userData.phone },
//                 { name: 'address', type: sql.VarChar(150), value: userData.address },
//                 { name: 'city', type: sql.VarChar(50), value: userData.city },
//                 { name: 'pincode', type: sql.VarChar(50), value: userData.pincode },
//                 { name: 'role', type: sql.VarChar(50), value: userData.role },
//                 { name: 'profile_image', type: sql.VarChar(50), value: userData.profile_image || '' },
//                 { name: 'company_id', type: sql.VarChar(50), value: userData.company_id || '' },
//                 { name: 'branch', type: sql.VarChar(50), value: userData.branch || '' },
//                 { name: 'last_login_ip', type: sql.VarChar(50), value: userData.last_login_ip || '' },
//                 { name: 'last_login', type: sql.VarChar(50), value: userData.last_login || '' },
//                 { name: 'last_logout', type: sql.VarChar(50), value: userData.last_logout || '' },
//                 { name: 'lock_screen', type: sql.VarChar(50), value: userData.lock_screen || '' },
//                 { name: 'lock_url', type: sql.VarChar(50), value: userData.lock_url || '' },
//                 { name: 'created_by', type: sql.VarChar(50), value: userData.created_by || '' },
//                 { name: 'modified_by', type: sql.VarChar(50), value: userData.modified_by || '' },
//                 { name: 'disabled_by', type: sql.VarChar(50), value: userData.disabled_by || '' },
//                 { name: 'disabled_on', type: sql.VarChar(50), value: userData.disabled_on || '' },
//                 { name: 'modules', type: sql.VarChar(150), value: userData.modules || '' },
//                 { name: 'submodules', type: sql.VarChar(150), value: userData.submodules || '' },
//                 { name: 'uniquecode', type: sql.VarChar(50), value: userData.uniquecode || '' },
//                 { name: 'access_login', type: sql.VarChar(50), value: userData.access_login || '' },
//                 { name: 'username', type: sql.VarChar(50), value: userData.username || '' },
//                 { name: 'gender', type: sql.VarChar(50), value: userData.gender || '' },
//                 { name: 'frgt_pwd_auth', type: sql.VarChar(50), value: userData.frgt_pwd_auth || '' },
//                 { name: 'appl_scanning', type: sql.VarChar(50), value: userData.appl_scanning || '' },
//                 { name: 'ref_by_name', type: sql.VarChar(50), value: userData.ref_by_name || '' },
//                 { name: 'ref_by_phone', type: sql.VarChar(50), value: userData.ref_by_phone || '' },
//                 { name: 'dl_no', type: sql.VarChar(50), value: userData.dl_no || '' },
//                 { name: 'pancard_no', type: sql.VarChar(50), value: userData.pancard_no || '' },
//                 { name: 'aadhar_no', type: sql.VarChar(50), value: userData.aadhar_no || '' },
//                 { name: 'voter_id', type: sql.VarChar(50), value: userData.voter_id || '' },
//                 { name: 'monthly_ctc', type: sql.VarChar(50), value: userData.monthly_ctc || '' },
//                 { name: 'special_rights', type: sql.VarChar(50), value: userData.special_rights || '' },
//                 { name: 'client_id', type: sql.VarChar(sql.MAX), value: userData.client_id || '' },
//                 { name: 'parent_office', type: sql.VarChar(150), value: userData.parent_office || '' },
//                 { name: 'approved', type: sql.TinyInt, value: userData.approved || 0 },
//                 { name: 'child_modules', type: sql.VarChar(50), value: userData.child_modules || '' }
//             ];

//             const result = await db.executeQuery(query, params);
//             return { id: result[0].id, ...userData };
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Update user
//     async updateUser(id, userData) {
//         try {
//             let setClause = '';
//             const params = [];
//             let paramIndex = 1;

//             // Dynamic SET clause based on provided fields
//             Object.keys(userData).forEach(key => {
//                 if (userData[key] !== undefined && key !== 'id') {
//                     if (setClause) setClause += ', ';
//                     setClause += `${key} = @param${paramIndex}`;
//                     params.push({
//                         name: `param${paramIndex}`,
//                         type: this.getSqlType(key),
//                         value: userData[key]
//                     });
//                     paramIndex++;
//                 }
//             });

//             // Add modified date
//             if (setClause) {
//                 setClause += ', modified_on = GETDATE()';
//             }

//             if (!setClause) {
//                 throw new Error('No fields to update');
//             }

//             params.push({ name: 'id', type: sql.Int, value: id });

//             const query = `
//                 UPDATE ${this.tableName}
//                 SET ${setClause}
//                 WHERE id = @id
//             `;

//             await db.executeQuery(query, params);
//             return this.getUserById(id);
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Delete user
//     async deleteUser(id) {
//         try {
//             const query = `
//                 DELETE FROM ${this.tableName}
//                 WHERE id = @id
//             `;
//             const params = [
//                 { name: 'id', type: sql.Int, value: id }
//             ];
//             await db.executeQuery(query, params);
//             return true;
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Helper method to get SQL type
//     getSqlType(fieldName) {
//         // Define field types based on your schema
//         const fieldTypes = {
//             id: sql.Int,
//             fullname: sql.VarChar(50),
//             password: sql.VarChar(50),
//             email: sql.VarChar(50),
//             phone: sql.VarChar(50),
//             address: sql.VarChar(150),
//             city: sql.VarChar(50),
//             pincode: sql.VarChar(50),
//             role: sql.VarChar(50),
//             profile_image: sql.VarChar(50),
//             company_id: sql.VarChar(50),
//             branch: sql.VarChar(50),
//             last_login_ip: sql.VarChar(50),
//             last_login: sql.VarChar(50),
//             last_logout: sql.VarChar(50),
//             lock_screen: sql.VarChar(50),
//             lock_url: sql.VarChar(50),
//             created_by: sql.VarChar(50),
//             created_on: sql.VarChar(50),
//             modified_by: sql.VarChar(50),
//             modified_on: sql.VarChar(50),
//             disabled_by: sql.VarChar(50),
//             disabled_on: sql.VarChar(50),
//             modules: sql.VarChar(150),
//             submodules: sql.VarChar(150),
//             uniquecode: sql.VarChar(50),
//             access_login: sql.VarChar(50),
//             username: sql.VarChar(50),
//             gender: sql.VarChar(50),
//             frgt_pwd_auth: sql.VarChar(50),
//             appl_scanning: sql.VarChar(50),
//             ref_by_name: sql.VarChar(50),
//             ref_by_phone: sql.VarChar(50),
//             dl_no: sql.VarChar(50),
//             pancard_no: sql.VarChar(50),
//             aadhar_no: sql.VarChar(50),
//             voter_id: sql.VarChar(50),
//             monthly_ctc: sql.VarChar(50),
//             special_rights: sql.VarChar(50),
//             client_id: sql.VarChar(sql.MAX),
//             parent_office: sql.VarChar(150),
//             approved: sql.TinyInt,
//             child_modules: sql.VarChar(50)
//         };

//         return fieldTypes[fieldName] || sql.VarChar(50);
//     }
// }

// module.exports = new User();

const db = require('../config/database');
const sql = require('mssql');

class User {
    constructor() {
        this.tableName = 'dbo.users';
    }

    // Get user by email and password (for login)
    async authenticate(email, password) {
        try {
            const query = `
                SELECT id, email, fullname, role, company_id, branch, 
                       profile_image, username, modules, submodules
                FROM ${this.tableName} 
                WHERE email = @email AND password = @password
                AND approved = 1
            `;
            
            const params = [
                { name: 'email', type: sql.VarChar(50), value: email },
                { name: 'password', type: sql.VarChar(50), value: password }
            ];
            
            const result = await db.executeQuery(query, params);
            return result[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Update last login
    async updateLastLogin(id, ipAddress) {
        try {
            const query = `
                UPDATE ${this.tableName}
                SET last_login = GETDATE(),
                    last_login_ip = @ipAddress
                WHERE id = @id
            `;
            
            const params = [
                { name: 'id', type: sql.Int, value: id },
                { name: 'ipAddress', type: sql.VarChar(50), value: ipAddress }
            ];
            
            await db.executeQuery(query, params);
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Check if email exists
    async checkEmailExists(email) {
        try {
            const query = `
                SELECT id, email 
                FROM ${this.tableName} 
                WHERE email = @email
            `;
            
            const params = [
                { name: 'email', type: sql.VarChar(50), value: email }
            ];
            
            const result = await db.executeQuery(query, params);
            return result[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Create new user (registration)
    async createUser(userData) {
        try {
            const query = `
                INSERT INTO ${this.tableName} (
                    fullname, password, email, phone, address, city, pincode,
                    role, profile_image, company_id, branch, 
                    created_on, modified_on, approved, 
                    username, gender
                ) VALUES (
                    @fullname, @password, @email, @phone, @address, @city, @pincode,
                    @role, @profile_image, @company_id, @branch, 
                    GETDATE(), GETDATE(), 1,
                    @username, @gender
                );
                SELECT SCOPE_IDENTITY() as id;
            `;

            const params = [
                { name: 'fullname', type: sql.VarChar(50), value: userData.fullname },
                { name: 'password', type: sql.VarChar(50), value: userData.password },
                { name: 'email', type: sql.VarChar(50), value: userData.email },
                { name: 'phone', type: sql.VarChar(50), value: userData.phone },
                { name: 'address', type: sql.VarChar(150), value: userData.address },
                { name: 'city', type: sql.VarChar(50), value: userData.city },
                { name: 'pincode', type: sql.VarChar(50), value: userData.pincode },
                { name: 'role', type: sql.VarChar(50), value: userData.role || 'user' },
                { name: 'profile_image', type: sql.VarChar(50), value: userData.profile_image || '' },
                { name: 'company_id', type: sql.VarChar(50), value: userData.company_id || '' },
                { name: 'branch', type: sql.VarChar(50), value: userData.branch || '' },
                { name: 'username', type: sql.VarChar(50), value: userData.username || userData.email.split('@')[0] },
                { name: 'gender', type: sql.VarChar(50), value: userData.gender || '' }
            ];

            const result = await db.executeQuery(query, params);
            return { id: result[0].id, ...userData };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new User();