'use strict'

const User = use('App/Models/User');
const customError = require('../../Utils/errorHandler');

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
            return response.status(201).json({
                success: true,
                message: 'Login successful',
                token
            });
        } catch (error) {
            const e = customError(response, error);
            return e;
        }
    }
}

module.exports = UserController
