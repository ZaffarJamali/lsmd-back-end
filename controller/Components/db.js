const express = require('express');
const mysql = require('mysql');
const db = express();


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BC170201058@vu.edu.pk',
    database: 'project'
});

db.post('/user', (req, res) => {
    let query = 'SELECT * FROM doctor';
    con.query(query, (err, results)=>{
        if(err){
            throw err;
        }else{
            res.json(results);
        };
    });
});
