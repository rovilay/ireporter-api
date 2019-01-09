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
    .middleware(['userDataValidator'])
    .validator('validateUserWithDB');

Route
    .post(`${baseUrl}/login`, 'UserController.loginUser')
    .middleware('guest');


// Incidents
Route
    .post(`${baseUrl}/incidents`, 'IncidentController.store')
    .middleware(['auth', 'incidentValidator']);

// Incident's media
Route
    .post(`${baseUrl}/incidents/:incidentId/media`, 'MediaController.store')
    .middleware(['auth', 'verifyIncidentUser', 'mediaValidator'])


// Non-existing routes
Route
    .any('*', ({ response }) => {
        return response.status(404).json({
            success: false,
            message: 'this route does not exist!'
        });
    })
