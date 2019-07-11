// const express = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BC170201058@vu.edu.pk',
    database: 'lsmd'
})

module.exports = {connection};