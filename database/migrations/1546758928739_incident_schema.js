'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IncidentSchema extends Schema {
  up () {
    this.create('incidents', (table) => {
      table.increments()
      table.timestamps()
      table.enu('type', ['red-flag', 'intervention'])
      table.text('comment', ['longtext']).notNullable()
      table
        .enu('status', ['draft', 'under investigation', 'resolved', 'rejected'])
        .notNullable()
      table.decimal('latitude', [10], [8]).notNullable()
      table.decimal('longitude', [11], [8]).notNullable()
      table.integer('userId').unsigned()
      table.foreign('userId').references('users.id')
    })
  }

  down () {
    this.drop('incidents')
  }
}

module.exports = IncidentSchema
