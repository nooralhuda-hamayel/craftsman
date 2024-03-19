const express = require('express');
const mysql = require('mysql');

const app = express();
const serverPort = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "craftsman"
})

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(serverPort, () => {
    console.log(`Craftsman server running at port ${serverPort}`)
})