'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var respuestaSchema = Schema({
    poll: {type: Schema.ObjectId, ref: 'polls' },
    user: {type: Schema.ObjectId, ref: 'users'},
    answer: [],
    comentario: String 
});
module.exports = mongoose.model('answers', respuestaSchema);