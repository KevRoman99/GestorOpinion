'use strict';

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../service/jwt');
var Poll = require('../models/encuesta');
var Respuesta = require('../models/respuesta');

function prueba (req, res){
    res.status(500).send({message: 'Bienvenido'});
}
function saveUser(req, res){
    var user = new User();
    var params = req.body;

            if (params.name && params.lastname && params.email && params.password ){
                user.name = params.name;
                user.lastname = params.lastname;
                user.email = params.email;

                    User.findOne({email: user.email.toLowerCase()}, (err, issetUser)=>{
                        if(err){
                            res.status(500).send({message: 'Error, el correo ya ha sido registrado'});
                        }else{
                            if(!issetUser){
                                bcrypt.hash(params.password, null, null, function(err, hash){
                                    user.password = hash;
    
                                    user.save((err, userStored)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error al guardar '});
                                        }else{
                                            if(!userStored){
                                                res.status(404).send({message: 'No se ha podido registrar el usuario'});
                                            }else{
                                                res.status(200).send({user: userStored});
                                            }
                                        }
                                    });
                                });
                            }else{
                                res.status(200).send({message: 'El correo ya fue registrado'});
                            }
                        }
                    });
                
            }else{
                res.status(500).send({message: 'Debes de llenar todos los campos requeridos'});
         
            }
}
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;
    if(userId != req.user.sub){
        res.status(500).send({message: 'No estas logeado'});
    }else{
        User.findByIdAndUpdate(userId,update,{new: true}, (err, updateUser)=>{
            if(err){
                res.status(500).send({message: 'Error al actualizar'});
            }else{
                if(!updateUser){
                    res.status(404).send({message: 'No se pudo actualizar'});
                }else{
                    res.status(200).send({user: updateUser});
                }
            }
        });
    }
    
}
function deleteUser(req, res){
    var userId = req.params.id;

    if(userId != req.user.sub){
        res.status(500).send({message: 'No estas logeado'});
    }else{
        User.findByIdAndDelete(userId, (err)=>{
            if(err){
                res.status(500).send({message: 'Error, al eliminar'});
            }else{
                res.status(200).send({message: 'Eliminado de la base de datos'});
            }
        });
    }
}
function login  (req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user)=>{
        if(err){
            res.status(500).send({message: 'Error al intentar iniciar seccion'});
        }else{
            if(user){
                bcrypt.compare(password, user.password, (err,check)=>{
                    if(check){
                        if(params.gettoken){
                            res.status(200).send({
                            token: jwt.createToken(user)
                            });
                        }else{
                            User.findOne({email: email}, (err, idEmail)=>{
                                if(err){
                                    res.status(500).send({message: 'Error'});
                                }else{
                                    var idUser = idEmail._id;
                                    Poll.find({creador: idUser}, (err, iisetPoll)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error al mostrar'});
                                        }else{
                                            if(!iisetPoll){
                                                res.status(404).send({message: 'Error al mostrar!'});
                                            }else{
                                                // res.status(200).send({Cuestionario: iisetPoll});
                                                Respuesta.find({user: idEmail}, (err, issetRes)=>{
                                                    if(err){
                                                        res.status(500).send({message: 'Error al mostrar'});
                                                    }else{
                                                        if(!issetRes){
                                                            res.status(500).send({message: 'Error al mostrar!'});
                                                        }else{
                                                            res.status(200).send({Respuestas:  issetRes, Cuestionario: iisetPoll})
                                                            
                                                        }
                                                    }
                                                });
            
                                            }
                                        }
                                    });                                }
                            });
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no pudo logearse'});
                    }
                    
                });
            }else{
                res.status(404).send({message: 'No se ha encotrando el usuario'});
            }
        }
    });
}
/* -----------------Cuestionario---------------*/
function savePoll(req,res){
    var poll = new Poll();
    var params = req.body;
    var idUser = req.params.id;

    if(idUser != req.user.sub){
        res.status(500).send({message: 'No estas logeado'})
    }else{
        if(params.titulo && params.question){
            poll.titulo = params.titulo;
            poll.question = params.question;
            poll.creador = idUser;

                poll.save((err, pollStored)=>{
                    if(err){
                        res.status(500).send({message: 'Error al guardar'})
                    }else{
                        if(!pollStored){
                            res.status(500).send({message: 'Error al guardar'});
                        }else{
                            res.status(200).send({poll: pollStored});
                        }
                    }
                });
                
        }else{
            res.status(500).send({message: 'Debes de llenar todos los campos requeridos'});
        }
    }
}
function updatePoll(req, res){
    var pollId = req.params.ide;
    var update = req.body;
    var userId = req.params.id;

    if(userId != req.user.sub){
        res.status(500).send({message: 'No esta logeeado'});
    }else{
        Poll.findOne({_id: pollId}, (err, issetRes)=>{
            if(err){
                res.status(500).send({message: 'Error al buscar'});
            }else{
                if(issetRes.creador == userId){
                    Poll.findByIdAndUpdate(pollId, update,{new: true},(err,updatePoll)=>{
                        if(err){
                            res.status(500).send({message: 'Error al actualizar'});
                        }else{
                            if(!updatePoll){
                                res.status(404).send({message: 'No se pudo actualizar'});
                            }else{
                                res.status(200).send({Cuestionario: updatePoll});
                            }
                        }
                    });
                }else{
                    res.status(500).send({message: 'No tienes el derecho para editar'});
                }
            }
        });
    }

}

function deletePoll(req,res){
    var userId = req.params.id;
    var pollId = req.params.ide;

    if(userId != req.user.sub){
        res.status(500).send({message: 'No estas logeado '});
    }else{
        Poll.findOne({_id: pollId}, (err, iissetPoll)=>{
            if(err){
                res.status(500).send({message: 'Error al buscar'});
            }else{
                if(iissetPoll.creador == userId){
                    Poll.findByIdAndDelete(pollId, (err)=>{
                        if(err){
                            res.status(500).send({message: 'Error al eliminar'});
                        }else{
                            res.status(200).send({message: 'Fue eliminado de la base de datos'});
                        }
                    })
                }else{
                    res.status(500).send({message: 'No tienes el derecho para eliminar'});
                }
            }
        });
        
    }

}
/*------------------Respuestas del cuestionario---------------------- */
function respuetaCuestionario(req, res){
    var userId = req.params.id;
    var params = req.body;
    var respuesta = new Respuesta();

    if(userId != req.user.sub){
        res.status(500).send({message: 'No Estas logeado'});
    }else{
        if(params.poll  && params.answer){
            respuesta.poll = params.poll;
            respuesta.user = userId;
            respuesta.answer = params.answer;
            respuesta.comentario = params.comentario;
            respuesta.save((err, resStored)=>{
                if(err){
                    res.status(500).send({message: 'Error al guardar'});
                }else{
                    if(!resStored){
                        res.status(404).send({message: 'No se ha podido guardar'});
                    }else{
                        res.status(200).send({answer: resStored});
                    }
                }
            });
        }else{
            res.status(500).send({message: 'Debes de llenar todos los campos'});
        }
    }
}

/*-----------Ver respuestas----------*/
function respuestaQuestion(req,res){
    var idUser = req.params.id;
    var cuestionId = req.params.ide;

    if(idUser != req.user.sub){
        res.status(500).send({message: 'No estas logeado '});
    }else{
        Respuesta.find({poll: cuestionId}, (err, issetRes)=>{
            if(err){
                res.status(500).send({message: 'Erroar al mostrar'});
            }else{
                if(!issetRes){
                    res.status(404).send({message: 'Erorr al mostrar'});
                }else{
                    
                    res.status(200).send({Respuestas: issetRes});
                }
            }
        });
    }
}
module.exports ={
    prueba,
    saveUser,
    login,
    updateUser,
    deleteUser,
    savePoll,
    respuetaCuestionario,
    updatePoll,
    deletePoll,
    respuestaQuestion
}