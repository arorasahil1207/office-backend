var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../schema/user_schema');
var config = require('../database/database')
var router = express.Router();

//route to llogin the current user..
router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then((user)=>{
        if(user.length <1){
            return res.status(409).json({
                message:'error finding the user , auth issues'
            })
        }
        else{
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err){
                    return res.status(500).json({
                        message:'error while decrypting '
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email:user[0].email,
                    },config.secret,{
                        expiresIn:'1h'
                    })
                    return res.status(200).json({
                        message:'user logged in successfully..',
                        token:token,
                        email:user[0].email,
                        status:200
                    })
                }
                return res.status(401).json({
                    message:'auth failed'
                })
            })
        }
    })
})
//router to create new user
router.post('/createuser',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        //checking if user email is already there in database
        if(user.length >1){
            return res.status(409).json({
                message:'Authentication failed, User already exists'
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        message:'error while encrypting the password'
                    })
                }
                else{
                    const user = new User({
                        email:req.body.email,
                        password:hash
                    })
                    user.save()
                    .then((result)=>{
                        return res.status(200).json({
                            message:'user created successfully.',
                            response:result
                        })
                    }).catch(error=>{
                        return res.status(500).json({
                            message:'error while creating the user...',
                            err:error
                        })
                    })
                }
            })
        }
    })
})

module.exports=router