'use strict';

var express = require('express');
var userController = require('../controllers/userController');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/prueba', userController.prueba);
api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.put('/updateUser/:id', md_auth.ensureAut,userController.updateUser);
api.put('/deleteUser/:id', md_auth.ensureAut,userController.deleteUser);
api.post('/saveCuestionario/:id',md_auth.ensureAut, userController.savePoll);
api.post('/Respuesta/:id', md_auth.ensureAut, userController.respuetaCuestionario);
api.put('/updateCuestionario/:id/:ide', md_auth.ensureAut, userController.updatePoll);
api.put('/deletePoll/:id/:ide', md_auth.ensureAut, userController.deletePoll); 
api.get('/Respuestas/:id/:ide', md_auth.ensureAut,userController.respuestaQuestion);
module.exports = api;