'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Incident = use('App/Models/Incident');
const Media = use('App/Models/Media');
const customError = require('../../Utils/errorHandler');
const modifyMedia = require('../../Utils/mediaModifier');

/**
 * Resourceful controller for interacting with incidents
 */
class IncidentController {
  /**
   * Create/save a new incident.
   * POST incidents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const { id: userId } = auth.user;
      let status, mediaUrl;
      const { comment, type, latitude, 
        images, videos, longitude
      } = request.body;
      const newIncident = await Incident.create({ 
        comment, type, latitude, longitude, status, userId
      });
      if (newIncident) {
        const modifiedImages = modifyMedia(images, 'image', newIncident.id);
        const modifiedVidoes = modifyMedia(videos, 'video', newIncident.id);
        await Media
          .createMany([...modifiedImages, ...modifiedVidoes]);
        mediaUrl = `/api/v1/incidents/${newIncident.id}/media`;
      }
      return response.status(201).json({
        success: true,
        message: 'incident created successfully',
        incident: newIncident,
        media: mediaUrl,
      });
    } catch (error) {
      console.log('i am in incident controller ', error);
      customError(response, error);
    }
  }

  /**
   * Update incident details.
   * PUT or PATCH incidents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a incident with id.
   * DELETE incidents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  // modifyMedia(mediaUrls, mediaType, incidentId) {
  //   if (mediaUrls && mediaType && incidentId) {
  //     const media = typeof mediaUrls === 'string' ? [mediaUrls] : mediaUrls;
  //     const modifiedMedia = media.map(url => ({ 
  //       url, incidentId, type: mediaType
  //     }));

  //     return modifiedMedia;
  //   }
  //   return [];
  // }
}

module.exports = IncidentController
