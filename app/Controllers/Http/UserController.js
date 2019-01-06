'use strict'

const User = use('App/Models/User');
const customError = require('../../Utils/errorHandler');

class UserController {
    async createUser({ request, response }) {
        try {
            const { firstName, lastName, email, profileImage, password } = request.body;
            const user = new User();
            throw Error('hellow')
        } catch (error) {
            const e = customError(response, error.message, 404);
            return e
        }
    }
}

module.exports = UserController
