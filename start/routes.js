'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const baseUrl = '/api/v1';

Route.get(baseUrl, () => 'Welcome to ireporter API');
Route.get('/', () => 'Welcome to ireporter API');

// Users
Route
    .post(`${baseUrl}/register`, 'UserController.createUser')
    .middleware(['userDataValidator']);

// Incidents
Route
    .post(`${baseUrl}/incidents`, 'IncidentController.store')
    .middleware(['incidentValidator'])
