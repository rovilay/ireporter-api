'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Media extends Model {
    incident() {
        return this.belongsTo('App/Models/Incident')
    }
}

module.exports = Media
