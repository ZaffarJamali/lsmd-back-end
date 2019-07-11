const jwt = require('jsonwebtoken');

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const {auth} = require('./controller/Components/auth');

var socket = require('socket.io');
const app = express();

server = app.listen(3001, () => console.log('server is running on port 3001'));

io = socket(server);

var socketIDs = [];

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    })
    
//     socket.on(senderID, function(data){
//         message = {
//             senID: senderID,
//             message: data.message 
//         }
//         io.emit(data.recID, message);
// });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BC170201058@vu.edu.pk',
    database: 'project'
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/auth', auth);
