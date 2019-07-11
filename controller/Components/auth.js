const express = require('express');
const jwt = require('jsonwebtoken');
const {connection} = require('./DBConnection');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const auth = express.Router();
// const auth = express();
let onlineDoctors = [];

auth.get('/api', verifyToken,  (req, res) => {
    res.json({
        message: 'Welcome to Api'
    });
});

auth.post('/api/post', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message: 'Post created',
                authData  
            });
        }
    });
});

//For Admin
auth.post('/api/login/admin', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let query = "SELECT * FROM project.user where email = '" +email+ "' and pass = '" +password+ "';"
    connection.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.json({
                message: 'Internal server error'
            }).status(501);
        }else{
            jwt.sign({user}, 'secretkey', { expiresIn: '500s'}, (err, token) => {
                console.log(token);
                res.json({
                    token
                });
            });
            console.log(result);
        }
    })
    
});

//For Patient
auth.post('/api/login/patient', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body);

    console.log(email, password);
    let query = "SELECT * FROM project.user where email = '" +email+ "' and pass = '" +password+ "';"
    connection.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.json({
                message: 'Internal server error'
            }).status(501);
        }else{
            console.log(result);
        }
    })
    const user= {
    }
    
    jwt.sign({user}, 'secretkey', { expiresIn: '500s'}, (err, token) => {
        console.log(token);
        let resp ={
            tok: token,
            onlineDocs: onlineDoctors
        }
        res.json({
            resp
        });
    });
});

//For Doctor
auth.post('/api/login/doctor', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body)

    console.log(email, password);
        let query = "SELECT fullName, email, degree, profession, expirence FROM project.user where email = '" +email+ "' and password = '" +password+ "';"
        await connection.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.json({
                message: 'Internal server error'
            }).status(501);
        }else{
            console.log(result[0]);
            jwt.sign({payload: result[0]}, 'secretkey', { expiresIn: '500s'}, (err, token) => {
                if (err) {
                    console.log(err)
                }
                console.log(token);
                //sockt code... 
                    //let onlineDoc = {
                    // docId: result[0].id,
                    // docChatId: socket.id
                    // }
                    //onlineDoctors.push(onlineDoc)
                    // socket.on(senderID, function(data){
                    //         message = {
                    //             senID: senderID,
                    //             message: data.message 
                    //         }
                    //          
                    //         io.emit(data.recID, message);
                    // });
                res.json(token);
            });
        }
    })
    })
    


//Registration
auth.post('/api/register/doctor', async (req, res) => {
    let fullName = req.body.fullName;
    let roleId = req.body.roleId;
    let email = req.body.email;
    let password = req.body.password;
    let profession = req.body.profession;
    let expirence = req.body.expirence;
    let degree = req.body.degree;
    console.log(req.body)

    console.log(fullName, roleId, email, password, profession, expirence, degree);

        let query = "INSERT INTO project.user (fullName, email, password, degree, profession, expirence, roleId) VALUES ('"+fullName+"', '"+email+"', '"+password+"', '"+degree+"', '"+profession+"', '"+expirence+"', '"+roleId+"');";
            await connection.query(query, (err, result) => {
            if(err){
                console.log(err);
                res.json({
                    message: 'Internal server error'
                }).status(501);
            }else{
                console.log(result[0]);
                jwt.sign({payload: result[0]}, 'secretkey', { expiresIn: '500s'}, (err, token) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(token);
                    res.json(token);
                });
            }
        })
      
      });



// Formate of Token
//Authorization: Bearer <access_token>

//VerifyToken
function verifyToken(req, res, next){
    //Get auth header value
    const bearerHeader = req.headers['authorization']
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // Spilt at space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //next middleware
        next();
    }else{
        //Forbidden
        res.sendStatus(403);
    }
}

module.exports = {auth};