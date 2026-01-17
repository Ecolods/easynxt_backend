const userModel = require('../models/user.model');

class UserController {
    // Get all users with pagination and filtering
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                fullname: req.query.fullname,
                email: req.query.email,
                phone: req.query.phone,
                role: req.query.role
            };

            const result = await userModel.getAllUsers(page, limit, filters);
            
            res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: result
            });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving users',
                error: error.message
            });
        }
    }

    // Get single user by ID
    async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.id);
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const user = await userModel.getUserById(userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: user
            });
        } catch (error) {
            console.error('Error in getUserById:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving user',
                error: error.message
            });
        }
    }

    // Create new user
    async createUser(req, res) {
        try {
            const userData = req.body;

            // Basic validation
            if (!userData.fullname || !userData.email || !userData.password) {
                return res.status(400).json({
                    success: false,
                    message: 'Fullname, email and password are required'
                });
            }

            // Check if email already exists
            const existingUser = await userModel.getUserByEmail(userData.email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            const newUser = await userModel.createUser(userData);
            
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: newUser
            });
        } catch (error) {
            console.error('Error in createUser:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: error.message
            });
        }
    }

    // Update user
    async updateUser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const userData = req.body;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            // Check if user exists
            const existingUser = await userModel.getUserById(userId);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const updatedUser = await userModel.updateUser(userId, userData);
            
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            console.error('Error in updateUser:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user',
                error: error.message
            });
        }
    }

    // Delete user
    async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            // Check if user exists
            const existingUser = await userModel.getUserById(userId);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            await userModel.deleteUser(userId);
            
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteUser:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting user',
                error: error.message
            });
        }
    }

    // Search users
    async searchUsers(req, res) {
        try {
            const searchTerm = req.query.q;
            
            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'Search term is required'
                });
            }

            const query = `
                SELECT * FROM dbo.users 
                WHERE fullname LIKE @searchTerm 
                   OR email LIKE @searchTerm 
                   OR phone LIKE @searchTerm
                ORDER BY id DESC
            `;

            const users = await userModel.executeQuery(query, [
                { name: 'searchTerm', type: sql.VarChar, value: `%${searchTerm}%` }
            ]);
            
            res.status(200).json({
                success: true,
                message: 'Search completed successfully',
                data: users
            });
        } catch (error) {
            console.error('Error in searchUsers:', error);
            res.status(500).json({
                success: false,
                message: 'Error searching users',
                error: error.message
            });
        }
    }
}

module.exports = new UserController();