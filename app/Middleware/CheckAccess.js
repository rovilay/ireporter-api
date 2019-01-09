'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const errorHandler = require('../Utils/ErrorHandler');

class AllowAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth }, next, properties) {
    try {
        const { role } = auth.user;
        console.log(auth)
        if (!properties.length || properties.includes(role)) {
            return await next();
        }
        const msg = 'you are not authroized to perform this operation';
        return errorHandler(response, null, null, msg, 403);
    } catch (error) {
        console.log(error);
        return errorHandler(response, error);
    }
  }
}

module.exports = AllowAccess;
