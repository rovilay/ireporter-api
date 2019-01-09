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
        comment, type: incidentType, latitude,
        images, videos, longitude
      } = request.body;
      
      let errors = {};
      const checkComment = IncidentValidator.validateComment(comment);
      const checkIncidentType = IncidentValidator.validateIncidentType(incidentType);
      const checkImages = urlValidator(images);
      const checkVideos = urlValidator(videos);
      const checkLocation = IncidentValidator.validateCoordinates(latitude, longitude);
      const urlImageError = checkImages ? { image:  checkImages } : {};
      const urlVideosError = checkVideos ? { videos:  checkVideos } : {};

      errors = {
        ...checkComment, ...checkIncidentType,
        ...urlImageError, ...urlVideosError, ...checkLocation
      };
      const errorsLength = Object.keys(errors).length;
      if (errorsLength) return errorHandler(
        response, null, errors, 'ValidationError', 400
      );
      await next();
    } catch (error) {
      return errorHandler(response);
    }
  }

  static validateComment(comment) {
    const errors = {};
    let err;

    if (!comment) {
      err = 'comment is required!';
    }

    if (err) errors.comment = err;

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
    } else if(!incidentType) {
      err = 'incident type is required!';
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
