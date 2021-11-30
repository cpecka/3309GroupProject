const express = require("express");

const app = express();
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
app.listen(80);