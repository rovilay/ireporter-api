'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Incident extends Model {
    user() {
        return this.belongsTo('App/Models/User', 'userId');
    }

    media() {
        return this.hasMany('App/Models/Media', 'id', 'incidentId');
    }
    setStatus(status) {
        const defaultStatus = 'draft';
        return status ? status : defaultStatus;
      }
}

module.exports = Incident
