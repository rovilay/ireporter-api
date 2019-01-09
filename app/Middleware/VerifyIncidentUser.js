'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const errorHandler = require('../Utils/ErrorHandler');
const Incident = use('App/Models/Incident');

class VerifyIncidentUser {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ params, response, auth }, next, properties) {
    try {
        const { role, id } = auth.user;
        const { incidentId } = params;
        const incident = await Incident.findOrFail(incidentId);

        const allowAdmin = properties.includes('allowAdmin');
        const isAdmin = ['admin', 'super admin'].includes(role);
        const ownIncident = incident.userId === id;
        const dontAllowOthers = !allowAdmin || (allowAdmin && !isAdmin);

        if (!ownIncident && dontAllowOthers) {
            const msg = 'you are not authroized to perform this operation';
            return errorHandler(response, null, null, msg, 403);
        }

        return await next();
    } catch (error) {
        console.log(error);
        return errorHandler(response, error);
    }
  }
}

module.exports = VerifyIncidentUser;
