'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Incident = use('App/Models/Incident');
const Media = use('App/Models/Media');
const Database = use('Database');
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

  async getIncidentMedia({ response, params }) {
    try {
      const { incidentId } = params;
      let media = await Database.from('media').where({ incidentId });

  
      return response.status(200).json({
        success: true,
        message: 'media retrieved successfully',
        media,
      });
    } catch (error) {
      customError(response, error);
    }
  }

  async deleteIncidentMedia({ response, params }) {
    try {
      const { incidentId, mediaId } = params;

      if (!Number.isInteger(Number(mediaId))) {
        const msg = 'media id must be an integer';
        return customError(response, null, null, msg, 400);
      }
      const media = await Media.findOrFail(mediaId);
      await media.delete();
      return response.status(200).json({
        success: true,
        message: 'incident Media deleted successfully',
      });
    } catch (error) {
      customError(response, error);
    }
  }
}

module.exports = MediaController
