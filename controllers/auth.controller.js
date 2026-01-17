const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs'); // For password hashing

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.fullname
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

class AuthController {
    // Login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                });
            }

            // Get user from database
            const user = await User.authenticate(email, password);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Update last login
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await User.updateLastLogin(user.id, ipAddress);

            // Generate token
            const token = generateToken(user);

            // Return success response
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        fullname: user.fullname,
                        role: user.role,
                        company_id: user.company_id,
                        branch: user.branch,
                        profile_image: user.profile_image,
                        modules: user.modules,
                        submodules: user.submodules
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Register
    async register(req, res) {
        try {
            const { 
                fullname, email, password, confirmPassword, 
                phone, address, city, pincode, gender 
            } = req.body;

            // Validation
            if (!fullname || !email || !password || !confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill in all required fields'
                });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Passwords do not match'
                });
            }

            // Check if email already exists
            const existingUser = await User.checkEmailExists(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Create user
            const userData = {
                fullname,
                email,
                password, // In production, hash this password
                phone: phone || '',
                address: address || '',
                city: city || '',
                pincode: pincode || '',
                gender: gender || '',
                role: 'user'
            };

            const newUser = await User.createUser(userData);

            // Generate token
            const token = generateToken(newUser);

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    token,
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        fullname: newUser.fullname,
                        role: newUser.role
                    }
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Forgot Password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email address'
                });
            }

            // Check if email exists
            const user = await User.checkEmailExists(email);
            
            if (!user) {
                // For security, don't reveal if email exists or not
                return res.status(200).json({
                    success: true,
                    message: 'If this email is registered, you will receive a reset link'
                });
            }

            // Generate reset token (in production, send email)
            const resetToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '1h' }
            );

            // Here you would typically:
            // 1. Save reset token to database
            // 2. Send email with reset link
            // 3. Return success response

            res.status(200).json({
                success: true,
                message: 'Password reset link sent to your email',
                data: {
                    resetToken // In production, don't send token in response
                }
            });

        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Verify Token
    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            // Get user details
            const user = await User.getUserById(decoded.id);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Token is valid',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        fullname: user.fullname,
                        role: user.role
                    }
                }
            });

        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    }
}

module.exports = new AuthController();