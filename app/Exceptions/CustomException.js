'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class CustomException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    console.log('error ====', error);
    response.status(500).send('some errors')
  }
}

module.exports = CustomException
