'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const errorHandler = require('../Utils/ErrorHandler');
const { urlValidator } = require('../Utils/urlValidator');

class UserValidator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    try {
      const { firstName, lastName, email, profileImage, password } = request.body;
  
      let errors = {};
      const checkEmail = UserValidator.validateEmail(email);
      const checkNames = UserValidator.validateNames(firstName, lastName);
      const checkPassword = UserValidator.validatePassword(password);
      const checkUrl = urlValidator(profileImage);
      const urlError = checkUrl ?
        { profileImage:  checkUrl } : {};
  
      errors = { ...checkEmail, ...checkNames, ...checkPassword, ...urlError };
      const errorsLength = Object.keys(errors).length;
      if (errorsLength) return errorHandler(
        response, null, errors, 'ValidationError', 400
      );
      await next();
    } catch (error) {
      return errorHandler(response);
    }
  }

  static validateEmail(email) {
    const errors = {};
    let err;
    if (email) {
      const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      const valid = regex.test(email);
      if (!valid) err = 'email is invalid!';
    } else {
      err = 'email is required!';
    }

    if (err) errors.email = err;

    return errors;
  }

  static validateNames(firstName, lastName) {
    const errors = {};
    let err;
    if (firstName && lastName) {
      const regex = /^[a-zA-Z-]+$/;
      const valid = regex.test(firstName) && regex.test(lastName);

      if (!valid) err = "firstname and lastname can only contain letters and/or hyphen";
    } else {
      err = 'firstname and lastname are required!';
    }

    if (err) errors.names = err;
    return errors;
  }

  static validatePassword(password) {
    const errors = {};
    let err;
    if (password && password.length < 7) {
      err = 'password must be greater than 6 characters';
    } else if (!password){
      err = 'password is required';
    }

    if (err) errors.password = err;
    return errors;
  }

  static allowAccess(usersAllowed) {
    const roles = ['user', 'admin', 'super admin'];
  }

  static async checkAccess({ request, response, auth }, next) {
    await next();
  }
}

module.exports = UserValidator;
