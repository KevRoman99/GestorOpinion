'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3789;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/gestorOpinion', {useNewUrlParser: true})
    .then((err, res)=>{
        console.log('Conexion a la base de datos realizada correactamente!!');
        app.listen(port, ()=>{
            console.log('El servidor de node y express estan conectados');
        });
    })
        .catch(err => console.log(err));