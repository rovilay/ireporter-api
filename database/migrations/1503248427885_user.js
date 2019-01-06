'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })

    this.alter('users', (table) => {
        table.string('firstName', 80)
            // .notNullable()
        table.string('lastName', 80)
            // .notNullable()
        table
          .string('profileImage')
          .notNullable()
          .defaultTo('https://res.cloudinary.com/rovilay/image/upload/v1546762436/profile-image-placeholder.png')
        table.dropColumn('username')
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
