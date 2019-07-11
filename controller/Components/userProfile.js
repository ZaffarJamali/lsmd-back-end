const jwt = require('jsonwebtoken');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {connection} = require('./DBConnection');
const app = express.Router();

//support parsing of application/jason type post data
app.use(bodyParser.json());


//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/doctor',  async (req, res) => {
    try{
        await connection.query('SELECT * FROM lsmd.doctor;', (error, results) => {
            if(error) throw error;
            console.log(results);
            res.status(200).json(results);
        })
    }
    catch(error){
        console.log(error);
    }
})

app.get('/admin', verifyToken, async (req, res) => {
    try{
        await connection.query('SELECT * FROM lsmd.admin;', (error, results) => {
            if(error) throw error;
            console.log(results);
            res.status(200).json(results);
        })
    }
    catch(error){
        console.log(error);
    }
})

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

module.exports = {app};