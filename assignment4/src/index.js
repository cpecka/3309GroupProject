const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();

const port = 4000;

const db = mysql.createConnection ({
    host: 'localhost', 
    user: 'root',  
    password: 'root', 
    database: 'hospitalAdmin'
});
  
db.connect((err) => {
    if (err) {
      throw err; 
    } 
    console.log('Connected to database'); 
});

global.db = db;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/GenerateReservation', (req,res) => {
    res.sendFile('staticContent/generateReservation.html', {root: __dirname })
})

app.get('/MoveReservation', (req,res) => {
    res.sendFile('staticContent/moveReservation.html', {root: __dirname })
})

app.get('/SearchSchedules', (req,res) => {
    res.sendFile('staticContent/searchSchedules.html', {root: __dirname })
})

app.get('/CalcReservationCost', (req,res) => {
    res.sendFile('staticContent/calcReservationCost.html', {root: __dirname })
})

app.get('/InsertPatient', (req,res) => {
    res.sendFile('staticContent/insertPatient.html', {root: __dirname })
})

app.use(express.static('staticContent'));

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });