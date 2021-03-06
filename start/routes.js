'use strict'

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

// User role
Route
    .patch(`${baseUrl}/users/role`, 'UserController.updateUserRole')
    .middleware(['auth', 'allowAccess:super admin']);


// Incidents
Route
    .post(`${baseUrl}/incidents`, 'IncidentController.store')
    .middleware(['auth', 'incidentValidator']);

Route
    .get(`${baseUrl}/incidents`, 'IncidentController.getAllIncidents')
    .middleware(['auth', 'verifyIncidentQuery']);

Route
    .get(`${baseUrl}/incidents/:incidentId`, 'IncidentController.getIncidentById')
    .middleware(['auth'], 'verifyIncidentUser:allowAll');

Route
    .put(`${baseUrl}/incidents/:incidentId`, 'IncidentController.update')
    .middleware(['auth', 'verifyIncidentUser', 'incidentValidator']);

Route
    .delete(`${baseUrl}/incidents/:incidentId`, 'IncidentController.destroy')
    .middleware(['auth', 'verifyIncidentUser']);

// Incident's media
Route
    .post(`${baseUrl}/incidents/:incidentId/media`, 'MediaController.store')
    .middleware(['auth', 'verifyIncidentUser', 'mediaValidator']);

Route
    .get(`${baseUrl}/incidents/:incidentId/media`, 'MediaController.getIncidentMedia')
    .middleware(['auth', 'verifyIncidentUser:allowAll']);

Route
    .delete(`${baseUrl}/incidents/:incidentId/media/:mediaId`, 'MediaController.deleteIncidentMedia')
    .middleware(['auth', 'verifyIncidentUser']);

// Incident status
Route
    .patch(`${baseUrl}/incidents/:incidentId/status`, 'IncidentController.updateIncidentStatus')
    .middleware(['auth', 'allowAccess:super admin,admin', 'verifyIncidentUser:allowAdmin']);


// Non-existing routes
Route
    .any('*', ({ response }) => {
        return response.status(404).json({
            success: false,
            message: 'this route does not exist!'
        });
    })
