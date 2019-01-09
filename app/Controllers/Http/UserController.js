'use strict'

const User = use('App/Models/User');
const customError = require('../../Utils/errorHandler');
const UserValidator = use('App/Middleware/UserValidator');

class UserController {
    async createUser({ request, response, auth }) {
        try {
            const { firstName, lastName, email, profileImage, password } = request.body;
            await User.create({
                firstName, email,
                lastName, profileImage, password
            });

            const token = await auth.attempt(email, password);
            return response.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: token
            });
        } catch (error) {
            const e = customError(response, error);
            return e;
        }
    }

    async loginUser({ request, response, auth }) {
        try {
            const { email, password } = request.body;
            const token = await auth.attempt(email, password);
            return response.status(200).json({
                success: true,
                message: 'Login successful',
                token
            });
        } catch (error) {
            return customError(response, error);
        }
    }

    async updateUserRole({ request, response, auth }) {
        try {
            const { email, role } = request.body;
            if (!['admin', 'user', 'super admin'].includes(role)) {
                const msg = 'user role can either be `super admin`, `admin`, or `user`';
                return customError(response, null, null, msg, 400);
            }

            const emailError = UserValidator.validateEmail(email);
            if (emailError.email) {
                return customError(response, null, null, emailError.email, 400);
            }

            const user = await User.findByOrFail({ email });
            user.role = role;
            await user.save();

            return response.status(200).json({
                success: true,
                message: 'user role updated successful',
                user: { 
                    email: user.email,
                    role: user.role,
                    id: user.id
                }
            });
        } catch (error) {
            return customError(response, error);
        }
    }
}

module.exports = UserController
