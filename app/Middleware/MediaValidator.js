'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const errorHandler = require('../Utils/ErrorHandler');
const { urlValidator } = require('../Utils/urlValidator');

class MediaValidator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    try {
      const { videos, images } = request.body;
  
      let errors = {};
      const checkImages = urlValidator(images);
      const checkVideos = urlValidator(videos);
      const urlImageError = checkImages ? { image:  checkImages } : {};
      const urlVideosError = checkVideos ? { videos:  checkVideos } : {};
  
      errors = {
        ...urlImageError, ...urlVideosError
      };
      const errorsLength = Object.keys(errors).length;
      if (errorsLength) return errorHandler(
        response, null, errors, 'ValidationError', 400
      );
      await next()
    } catch (error) {
      return errorHandler(response);
    }
  }
}

module.exports = MediaValidator;
