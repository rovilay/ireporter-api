'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Token extends Model {
    async check({ request, response, auth }) {
        try {
            await auth.check()
        } catch (error) {
            response.send(error.message)
        }
    }
}

module.exports = Token
