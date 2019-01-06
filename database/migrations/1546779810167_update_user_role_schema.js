'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateUserRoleSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table
        .enu('role', ['super admin', 'admin', 'user'])
        .defaultTo('user')
        .notNullable()
    })
  }

  down () {
    this.table('users', (table) => {
      this.dropIfExists('users')
    })
  }
}

module.exports = UpdateUserRoleSchema
