'use stric';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    password: String
});

module.exports = mongoose.model('users', userSchema);