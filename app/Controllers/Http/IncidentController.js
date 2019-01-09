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
        await Media.createMany([...modifiedImages, ...modifiedVidoes]);
        mediaUrl = `/api/v1/incidents/${newIncident.id}/media`;
      }
      return response.status(201).json({
        success: true,
        message: 'incident created successfully',
        incident: newIncident,
        media: mediaUrl,
      });
    } catch (error) {
      customError(response, error);
    }
  }

  async getAllIncidents({ request, response, auth }) {
    try {
      const { id: userId } = auth.user;
      const personal = request.input('personal');
      const type = request.input('type');
      let where = personal === 'true' ? { userId } : {};
      where = type ? { ...where, type } : where;
      

      let incidents = await Database.from('incidents').where(where);
      incidents = this.generateMediaUrl(incidents);

      return response.status(200).json({
        success: true,
        message: 'incidents fetched successfully',
        incidents
      });
    } catch (error) {
      customError(response, error);
    }
  }

  async getIncidentById({ params, request, response }) {
    try {
      const { incidentId } = params;
      let incident = await Incident.findOrFail(incidentId);
      const mediaUrl = `api/v1/incidents/${incident.id}/media`
      return response.status(200).json({
        success: true,
        message: 'incident fetched successfully',
        incident: { ...incident.$attributes, mediaUrl}
      });
    } catch (error) {
      customError(response, error);
    }
  }

  async update ({ params, request, response, auth }) {
    try {
      const { incidentId } = params;
      const { comment, type, longitude, latitude, images, videos } = request.body

      const incident = await Incident.findOrFail(incidentId);
      incident.merge({ comment, type, longitude, latitude });
      const updatedIncident = await incident.save();

      if (updatedIncident) {
        await this.mediaUpdate(images, videos, incidentId);
      }

      return response.status(200).json({
        success: true,
        message: 'incident updated successfully',
        incident: { ...incident.$attributes, 
          mediaUrl: `/api/v1/incidents/${incidentId}/media`}
      });
    } catch (error) {
      customError(response, error);
    }
  }

  async mediaUpdate(images, videos, incidentId) {
    try {
      const modifiedImages = modifyMedia(images, 'image', incidentId);
      const modifiedVidoes = modifyMedia(videos, 'video', incidentId);
      if (modifiedImages.length) {
          await Media.query().where({ incidentId, type: 'image' }).delete();
      }

      if (modifiedVidoes.length) {
          await Media.query().where({ incidentId, type: 'video' }).delete();
      }

      await Media.createMany([...modifiedImages, ...modifiedVidoes]);

    } catch (error) {
      customError(response, error); 
    }
  }

  async destroy({ params, response }) {
    try {
      const { incidentId } = params;

      await Media.query().where({ incidentId }).delete();
      const incident = await Incident.findOrFail(incidentId);
      await incident.delete();

      return response.status(200).json({
        success: true,
        message: 'incident deleted successfully',
      });
    } catch (error) {
      customError(response, error);
    }
  }

  generateMediaUrl(incidients) {
    const incidentsWithMediaUrl = incidients.map(incident => {
      const mediaUrl = `/api/v1/incidents/${incident.id}/media`;
      return { ...incident, mediaUrl };
    });

    return incidentsWithMediaUrl;
  }
}

module.exports = IncidentController
