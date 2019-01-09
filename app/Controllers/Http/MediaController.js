'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Incident = use('App/Models/Incident');
const Media = use('App/Models/Media');
const customError = require('../../Utils/errorHandler');
const modifyMedia = require('../../Utils/mediaModifier');

/**
 * Resourceful controller for interacting with media
 */
class MediaController {
  async store({ request, response, params }) {
    try {
      const { images, videos } = request.body;
      const { incidentId } = params;

      const modifiedImages = modifyMedia(images, 'image', incidentId);
      const modifiedVidoes = modifyMedia(videos, 'video', incidentId);
      const newMedia = await Media.createMany([...modifiedImages, ...modifiedVidoes]);

      return response.status(201).json({
        success: true,
        message: 'media added successfully',
        newMedia,
      });

    } catch (error) {
      customError(response, error);
    }
  }
}

module.exports = MediaController
