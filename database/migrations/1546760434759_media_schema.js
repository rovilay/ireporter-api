'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MediaSchema extends Schema {
  up () {
    this.create('media', (table) => {
        table.increments()
        table.timestamps()
        table.text('url', ['mediumtext']).notNullable()
        table.enu('type', ['image', 'video']).notNullable()
        table.integer('incidentId').unsigned()
        table
            .foreign('incidentId')
            .references('incidents.id')
            .onDelete('cascade')
    })
  }

  down () {
    this.drop('media')
  }
}

module.exports = MediaSchema
