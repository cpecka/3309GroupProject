const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
let rRoomNo;
let rEID;
let resDateTime ="";

const app = express();

const port = 5500;

function newConnection() {
const db = mysql.createConnection ({
    host: 'localhost', 
    user: 'root',  
    password: 'BATson42', 
    database: 'hospitalAdmin'
});
return db;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/GenerateReservation', (req,res) => {
    res.sendFile('staticContent/generateReservation.html', {root: __dirname })
})

app.post('/genReservation1', (req, res) => {
    let conn = newConnection();
    conn.connect();
    const setRoomNo = (no) =>{
        rRoomNo=no;
    }
    const setEquipmentID = (id) =>{
        rEID=id;
    }
    let resTime=" ";
    if(req.get("time")<10){
        resTime+="0";
    }
    resTime+=req.get("time");

    resDateTime= req.get("day") +resTime+ ":00:00";

    conn.query(`SELECT availability From StaffSchedule \n`+
                `Where (doctorID = ${req.get("doctorID")} AND sTime = '${resDateTime}')`
        ,(err,rows,fields) => {
            if(err) {
                console.log(err);
            }
            else {
                if(rows==null){
                    res.send("Sorry! doctor "+req.get("doctorID")+" is unavailable at your chosen time.");
                    return;
                }
                if(rows[0].availability=='0'){
                    res.send("Sorry! doctor "+req.get("doctorID")+" is unavailable at your chosen time.");
                    return;
                }
            }
        });
    conn.query(`SELECT rs.roomNo From RoomSchedule rs \n`+
                `Where (SELECT r.roomNo FROM ROOM r \n`+
                `Where (rs.sTime = '${resDateTime}' AND rs.availability = true AND r.hospitalWing = '${req.get("wing")}' AND r.roomNo = rs.roomNo))`
        ,(err,rows,fields) => {
            if(err) {
                console.log(err);
            }
            else {
                if (rows.length == 0) {
                    res.send("Sorry! every room in wing " + req.get("wing") + " is unavailable at your chosen time.");
                    return;
                }
                setRoomNo(rows[0].roomNo);
            }
        });
    conn.query(`SELECT es.equipmentID from EquipmentSchedule es \n` +
        `Where (Select me.equipmentID from MedicalEquipment me \n` +
        `Where (es.sTime = '${resDateTime}' AND es.availability = true AND me.equipmentType = '${req.get("equiType")}' AND me.equipmentID = es.equipmentID))`
        , (err, rows, fields) => {
            if (err) {
                console.log(err);
            }
            else {
                if (rows.length == 0) {
                    if (req.get("equiType") == "Forceps") {
                        res.send("Sorry! There are no " + req.get("equiType") + " unavailable at your chosen time.");
                        return;
                    }
                    res.send("Sorry! There are no " + req.get("equiType") + "s unavailable at your chosen time.");
                    return;
                }
                setEquipmentID(rows[0].equipmentID);
            }
        });
    conn.end();
})
app.post('/genReservation2', (req, res) => {
    let conn = newConnection();
    conn.connect();
    conn.query(`Update StaffSchedule \n` +
        `Set availability = false \n` +
        `Where(sTime = '${resDateTime}' AND doctorID = ${req.get("doctorID")})`
        , (err, rows, fields) => {
            if (err) {
                console.log(err);
            }
        });
    conn.query(`Update RoomSchedule \n` +
        `Set availability = false \n` +
        `Where(sTime = '${resDateTime}' AND roomNo = ` + rRoomNo + `)`
        , (err, rows, fields) => {
            if (err) {
                console.log(err);
            }
        });

    conn.query(`Update EquipmentSchedule \n` +
        `Set availability = false \n` +
        `Where(sTime = '${resDateTime}' AND equipmentID = ` + rEID + `)`
        , (err, rows, fields) => {
            if (err) {
                console.log(err);
            }
        });
    conn.query(`INSERT INTO Reservation VALUES ('${resDateTime}',`+ req.get("doctorID") +`, ` + rRoomNo + `, '`+ req.get("priority") +`', ` + rEID + `);`
        , (err, rows, fields) => {
            if (err) {
                console.log(err);
            }
            else{
                res.send("Reservation added "+ resDateTime+" with doctor number "+req.get("doctorID")+ " in room "+ rRoomNo +". \nThe priority level is "+ req.get("priority")+".");
            }
        });
    conn.end();
})

app.get('/MoveReservation', (req, res) => {
    res.sendFile('staticContent/moveReservation.html', { root: __dirname })
})

app.get('/SearchSchedules', (req,res) => {
    res.sendFile('staticContent/searchSchedules.html', {root: __dirname })
})

app.post('/SearchSResults', (req, res) => {
    let schedule = `<h2> ${req.body.scheduleType} for ID (or No) ${req.body.sId} on ${req.body.sDate} </h2><br/>`
    schedule += `<style>
    table, th, td {
        border: 1px solid black;
      } </style>`
    let conn = newConnection();
    conn.connect();

    let date = String(req.body.sDate)
    date = date.substring(0,date.indexOf('-')) + date.substring(date.indexOf('-') + 1, date.indexOf('-' ,date.indexOf('-') + 1)) + date.substring(date.indexOf('-' ,date.indexOf('-') + 1) + 1);

    if(req.body.scheduleType == 'Room Schedule'){
        conn.query(`SELECT * FROM roomschedule 
                    WHERE Date(sTime) = ${date} 
                    AND roomNo = ${req.body.sId} 
                    ORDER BY availability;`
            ,(err,rows,fields) =>{

                schedule += `<table style="width:100%">`
                schedule += `<tr><th>RoomNo</th><th>Operating Times</th><th>Availability</th></tr>`
                for(r of rows){
                    let time = String(r.sTime);
                    time= time.substring(time.indexOf(':') - 2, time.indexOf('G'));
                    schedule += `<tr><td> ${r.roomNo} </td>`
                    schedule += `<td> ${time} </td>`
                    schedule += `<td> ${r.availability} </td></tr>`
                }
                schedule += `</table>`
                schedule += `<form action="/">
                                <br/><button>Return to Home Page</button>
                             </form>`
                res.send(schedule);
        })
    }
    else if(req.body.scheduleType == 'Doctor Schedule'){
        conn.query(`SELECT * FROM 
                (SELECT * FROM Doctor NATURAL JOIN staffschedule) AS doctorSchedule
                WHERE Date(sTime) = ${date} 
                AND doctorID = ${req.body.sId} 
                ORDER BY availability;`
            ,(err,rows,fields) =>{

                schedule += `<table style="width:100%">`
                schedule += `<tr><th>DoctorID</th><th>First Name</th><th>Last Name</th><th>Specialty</th><th>Operating Times</th><th>Shift</th><th>Availability</th></tr>`
                for(r of rows){
                    let time = String(r.sTime);
                    time= time.substring(time.indexOf(':') - 2, time.indexOf('G'));
                    schedule += `<tr><td> ${r.doctorID} </td>`
                    schedule += `<td> ${r.dFirstName} </td>`
                    schedule += `<td> ${r.dLastName} </td>`
                    schedule += `<td> ${r.specialty} </td>`
                    schedule += `<td> ${time} </td>`
                    schedule += `<td> ${r.shift} </td>`
                    schedule += `<td> ${r.availability} </td></tr>`
                }
                schedule += `</table>`
                schedule += `<form action="/">
                                <br/><button>Return to Home Page</button>
                             </form>`
                res.send(schedule);
        })
    }
    else{
        conn.query(`SELECT * FROM
                    (SELECT equipmentID, equipmentType, sTime, availability FROM medicalequipment NATURAL JOIN equipmentschedule) AS eSchedule
                    WHERE Date(sTime) = ${date} 
                    AND equipmentID = ${req.body.sId}
                    ORDER BY availability;`
            ,(err,rows,fields) =>{

                schedule += `<table style="width:100%">`
                schedule += `<tr><th>EquipmentID</th><th>Equipment Type</th><th>Operating Times</th><th>Availability</th></tr>`
                for(r of rows){
                    let time = String(r.sTime);
                    time= time.substring(time.indexOf(':') - 2, time.indexOf('G'));
                    schedule += `<tr><td> ${r.equipmentID} </td>`
                    schedule += `<td> ${r.equipmentType} </td>`
                    schedule += `<td> ${time} </td>`
                    schedule += `<td> ${r.availability} </td></tr>`
                }
                schedule += `</table>`
                schedule += `<form action="/">
                                <br/><button>Return to Home Page</button>
                             </form>`
                res.send(schedule);
        })
    }
    conn.end();
})

app.get('/CalcReservationCost', (req,res) => {
    res.sendFile('staticContent/calcReservationCost.html', {root: __dirname })
})

app.post('/calculateCost', (req, res) => {
    let conn = newConnection();
    conn.connect();
    let cost = 0;
    conn.query(`SELECT (equipmentCost + roomCost + 200) AS total \n` +
             `FROM room, medicalEquipment \n` +
             `WHERE roomNo = ${req.get("roomNo")} AND equipmentID = ${req.get("equipmentID")}`
        ,(err,rows,fields) => {
            if(err) {
                console.log(err);
            }
            else {
                for (let r of rows) {
                    cost += r.total;
                }
                if (cost>0)
                    res.send("Your computed cost for any reservation concerning that room and piece of equipment is $" + cost.toFixed(2));
                else
                    res.send("Sorry, but one or more of your inputs were illegal at this time");
            }
        });
    conn.end();
})
app.get('/DisplayReservation', (req,res) => {
    res.sendFile('staticContent/displayReservations.html', {root: __dirname })
})

app.post('/displayReservations', (req,res) => {
    let conn = newConnection();
    conn.connect();
    let content = '';

    let date = req.get('resDate');
    date = date.substring(0,date.indexOf('-')) + date.substring(date.indexOf('-') + 1, date.indexOf('-' ,date.indexOf('-') + 1)) + date.substring(date.indexOf('-' ,date.indexOf('-') + 1) + 1);

    conn.query(`SELECT d.dFirstName, d.dLastName, d.specialty, r.* 
        FROM Doctor d
        JOIN Reservation r ON d.doctorID = r.doctorID
        WHERE Date(sTime ) = '${date}' 
        ` 
        //${req.body.reservationDate  }     
        ,(err,rows,fields) => {
            if(err) {
                console.log(err);
            } else {
                console.log(rows);
                content += `<style>
                            table, th, td {
                                border: 1px solid black;
                            } </style>`
                content += `<table style = "width:100%">`
                content += `<tr><th>DoctorID</th><th>First Name</th><th>Last Name</th><th>Specialty</th><th>Appointment Time</th><th>Room No.</th><th>Priority</th><th>Equipment No.</th></tr>`
                for (r of rows) {
                    content += `<div>`
                    content += `<tr>`
                    content += `<td> ${r.doctorID}</td>`
                    content += `<td> ${r.dFirstName}</td>`
                    content += `<td> ${r.dLastName}</td>`
                    content += `<td> ${r.specialty}</td>`
                    content += `<td> ${r.sTime}</td>`
                    content += `<td> ${r.roomNo}</td>`
                    content += `<td> ${r.priority}</td>`
                    content += `<td> ${r.equipmentID}</td>`
                    content += `<tr>`
                    content += `</div>`
                }
                content += `</table>`
            }
            res.send(content)
        }
    )
    conn.end();
})

app.get('/InsertPatient', (req,res) => {
    res.sendFile('staticContent/insertPatient.html', {root: __dirname })
})

app.post('/insertPatient', (req, res) => {
    let conn = newConnection();
    conn.connect();

    let content = '';

    conn.query(`INSERT INTO Patient VALUES (
        ${req.get("healthCardNo")}, '${req.get("pFirstName")}', '${req.get("pLastName")}', ${req.get("dob")}, '${req.get("sex")}', 11)`
        , (err, rows, fields) => {

        if(err) {
            content += '<br>One or more value(s) inputted are invalid or duplicated';
            res.send(content);
        }
        else {
            let dateOfBirth = req.get("dob");
            let year = dateOfBirth.substring(0,4);
            let month = dateOfBirth.substring(4,6);
            let day = dateOfBirth.substring(6,8);

            content += '<div>';
            content += '<br>Patient was added, review patient details below'
            content += '<br><br>'
            content += 'Name: ' + req.get("pFirstName") + ' ' + req.get("pLastName") + '<br>'
            content += 'Health Card Number: ' + req.get("healthCardNo") + '<br>'
            content += 'Date of Birth (YYYY/MM/DD): ' + year + '/' + month + '/' + day + '<br>'
            content += 'Sex: ' + req.get("sex")
            content += '</div>';

            res.send(content);
        }
    });
    
    conn.end();
})

app.use(express.static('staticContent'));

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});