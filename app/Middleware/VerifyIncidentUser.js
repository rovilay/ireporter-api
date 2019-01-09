'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const errorHandler = require('../Utils/ErrorHandler');
const Incident = use('App/Models/Incident');

class VerifyIncidentUser {
    async handle ({ params, response, auth }, next, properties) {
        try {
            const { role, id } = auth.user;
            const { incidentId } = params;

            if (!Number.isInteger(Number(incidentId))) {
                const msg = 'incident id must be an integer';
                return errorHandler(response, null, null, msg, 403);
            }

            const incident = await Incident.findOrFail(incidentId);

            const allowAdmin = properties.includes('allowAdmin');
            const allowAll = properties.includes('allowAll');
            const isAdmin = ['admin', 'super admin'].includes(role);
            const ownIncident = incident.userId === id;

            if (allowAll || ownIncident || (allowAdmin && isAdmin)) {
                return await next();
            }

            const msg = 'you are not authroized to perform this operation';
            return errorHandler(response, null, null, msg, 403);

        } catch (error) {
            return errorHandler(response, error);
        }
    }
}

module.exports = VerifyIncidentUser;
