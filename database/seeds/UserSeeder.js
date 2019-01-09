'use strict'


/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database');
const User = use('App/Models/User');
const Env = use('Env')


class UserSeeder {
  async run () {
    try {
      const users = await Database.table('users');
      const superAdmin = {
        firstName: Env.get('SUPER_ADMIN_FIRSTNAME'),
        lastName: Env.get('SUPER_ADMIN_LASTNAME'),
        email: Env.get('SUPER_ADMIN_EMAIL'),
        password: Env.get('SUPER_ADMIN_PASSWORD'),
        profileImage: Env.get('SUPER_ADMIN_PROFILE_IMAGE'),
        role: 'super admin',
      }
      await User.create(superAdmin);
    } catch (error) {
      return error;
    }
  }
}

module.exports = UserSeeder;
