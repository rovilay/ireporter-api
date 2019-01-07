'use strict'

class validateUserWithDB {
  get rules () {
    return {
      email: 'required|email|unique:users',
    }
  }

  get messages () {
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
    }
  }

  async fails ([errorMessages]) {
    return this.ctx.response.status(400).send({ ...errorMessages, success: false});
  }
}

module.exports = validateUserWithDB
