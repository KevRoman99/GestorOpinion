'use string';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encuestaSchema = Schema({
    titulo: String,
    question: String,
    respuesta: {type: Schema.ObjectId, ref: 'answers'},
    creador: {type: Schema.ObjectId, ref: 'users'},
});
module.exports = mongoose.model('polls', encuestaSchema);