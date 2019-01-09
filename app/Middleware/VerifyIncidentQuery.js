'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const errorHandler = require('../Utils/ErrorHandler');
const Incident = use('App/Models/Incident');

class VerifyIncidentQuery {
    async handle ({ request, response }, next) {
        try {
            const personal = request.input('personal');
            const type = request.input('type');

            const personalQueryErrorMsg = 'personal query must either be true or false';
            const typeQueryErrorMsg = 'type query must either be `red-flag` or `intervention';

            const checkPersonalQuery = this.checkQuery(
                personal, ['true', 'false', ''], 'personalQuery', personalQueryErrorMsg);
            const checkTypeQuery = this.checkQuery(
                type, ['red-flag', 'intervention', ''], 'typeQuery', typeQueryErrorMsg);

            const queryErrors = { ...checkPersonalQuery, ...checkTypeQuery };
            const errorsLength = Object.keys(queryErrors).length;
            if (errorsLength) return errorHandler(
                response, null, queryErrors, 'Query Error', 400);

            return await next();
        } catch (error) {
            return errorHandler(response, error);
        }
    }

    checkValue(value, expectedValues) {
        return expectedValues.includes(value);
    }
    
    checkQuery(query, expectedValues, errorKey, errorMessage) {
        let error = {};
        if (query) {
            const validQuery = this.checkValue(query, expectedValues);
            validQuery ? error : error[`${errorKey}`] = errorMessage;
        }
        return error;
    }
}

module.exports = VerifyIncidentQuery;
