'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const errorHandler = require('../Utils/ErrorHandler');
const { urlValidator } = require('../Utils/urlValidator');

class IncidentValidator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    try {
      const {
        description, type: incidentType, latitude,
        images, videos, longitude
      } = request.body;
      
      let errors = {};
      const checkDescription = IncidentValidator.validateDescription(description);
      const checkIncidentType = IncidentValidator.validateIncidentType(incidentType);
      const checkImages = urlValidator(images);
      const checkVideos = urlValidator(videos);
      const checkLocation = IncidentValidator.validateCoordinates(latitude, longitude);
  
      errors = {
        ...checkDescription, ...checkIncidentType,
        images: checkImages, videos: checkVideos, ...checkLocation
      };
      const errorsLength = Object.keys(errors).length;
      if (errorsLength) return errorHandler(response, 'ValidationError', 400, errors);
      await next();
    } catch (error) {
      return errorHandler(response);
    }
  }

  static validateDescription(description) {
    const errors = {};
    let err;

    if (!description) {
      err = 'description is required!';
    }

    if (err) errors.description = err;

    return errors;
  }

  static validateIncidentType(incidentType) {
    const errors = {};
    let err;
    if (
        incidentType && 
        !['red-flag', 'intervention'].includes(incidentType.toString().toLowerCase())
      ) {
      err = "incident type must either be 'red-flag' or 'intervention'";
    } else {
      err = 'IncidentType is required!';
    }

    if (err) errors.type = err;

    return errors;
  }

  static validateCoordinates(latitude, longitude) {
    const errors = {};
    let err;

    if (latitude && longitude) {
      const regex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
      const valid = regex.test(`${latitude}, ${longitude}`);
      if (!valid) err = 'latitude and/or longitude is invalid';
    } else {
      err = 'latitude and/or longitude is required!'
    }

    if (err) errors.location = err;
    return errors;
  }
}

module.exports = IncidentValidator
