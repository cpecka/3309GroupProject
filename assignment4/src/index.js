const express = require("express"); //Requiring express
const bodyParser = require('body-parser');  //Requiring body-parser
const mysql = require('mysql'); //Requiring MYSQL
const path = require('path');   //Requiring path

let rRoomNo;    //holds a room number (for generating reservations)
let rEID;   //holds an equipment ID (for generating reservations)
let resDateTime ="";    //holds the datetime of a reservation

const app = express();  //allow us to use express by referencing it in an app variable

const port = 5500;  //port to listen to

//Function which allows us to make a connection to our database hosted in MYSQL
function newConnection() {
const db = mysql.createConnection ({
    host: 'localhost', 
    user: 'root',  
    password: 'root', 
    database: 'hospitalAdmin'
});
return db;
}

//Necessary app.use statements
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Get method which opens up the page for generating a reservation
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
                        res.send("Sorry! There are no " + req.get("equiType") + " available at your chosen time.");
                        return;
                    }
                    res.send("Sorry! There are no " + req.get("equiType") + "s available at your chosen time.");
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

//Get method which opens up the page for searching the various schedules
app.get('/SearchSchedules', (req,res) => {
    res.sendFile('staticContent/searchSchedules.html', {root: __dirname })
})

//Post method to genrate the schedule to be displayed
app.post('/SearchSResults', (req, res) => {
    let schedule = `<h2> ${req.body.scheduleType} for ID (or No) ${req.body.sId} on ${req.body.sDate} </h2><br/>`   //header
    schedule += `<style>
    table, th, td {
        border: 1px solid black;
      } </style>`   //table styling
    let conn = newConnection();
    conn.connect(); //establishing connection

    let date = String(req.body.sDate)   //Formatting the user entered date
    date = date.substring(0,date.indexOf('-')) + date.substring(date.indexOf('-') + 1, date.indexOf('-' ,date.indexOf('-') + 1)) + date.substring(date.indexOf('-' ,date.indexOf('-') + 1) + 1);    //Formatting the date more

    //For room schedules
    if(req.body.scheduleType == 'Room Schedule'){
        conn.query(`SELECT * FROM roomschedule 
                    WHERE Date(sTime) = ${date} 
                    AND roomNo = ${req.body.sId} 
                    ORDER BY availability;` //Query
            ,(err,rows,fields) =>{

                schedule += `<table style="width:100%">`    //Formatting table
                schedule += `<tr><th>Operating Times</th><th>Availability</th></tr>` //Formatting table headers
                for(r of rows){
                    let time = String(r.sTime); //Formatting time
                    time= time.substring(time.indexOf(':') - 2, time.indexOf('G')); //Formatting time more
                    schedule += `<td> ${time} </td>`    //Inserting time in one column
                    if (r.availability == 1) {
                        schedule += `<td>Available</td></tr>` //Inserting room's availability in one column
                    }
                    else {
                        schedule += `<td>Not Available</td></tr>` //Inserting room's availability in one column
                    }
                }
                schedule += `</table>`  //Ending table
                schedule += `<form action="/">
                                <br/><button>Return to Home Page</button>
                             </form>`   //Adding return to home option
                res.send(schedule); //Sending the table to client
        })
    }

    //For staff schedules
    else if(req.body.scheduleType == 'Doctor Schedule'){
        conn.query(`SELECT * FROM 
                (SELECT * FROM Doctor NATURAL JOIN staffschedule) AS doctorSchedule
                WHERE Date(sTime) = ${date} 
                AND doctorID = ${req.body.sId} 
                ORDER BY availability;` //Query
            ,(err,rows,fields) =>{

                schedule += `<table style="width:100%">`    //Formatting table
                schedule += `<tr><th>Operating Times</th><th>Shift</th><th>Availability</th></tr>`  //Formatting table headers
                let docName = '';
                for(r of rows){ 
                    let time = String(r.sTime); //Formatting time 
                    time= time.substring(time.indexOf(':') - 2, time.indexOf('G')); //Formatting time more
                    schedule += `<td> ${time} </td>`    //Inserting the time in one column
                    schedule += `<td> ${r.shift} </td>` //Inserting doctor's shift in one column
                    if (r.availability == null) {
                        schedule += `<td>Not at Hospital</td></tr>` //Inserting doctor's availability in one column
                    }
                    else if (r.availability == 1) {
                        schedule += `<td>Available</td></tr>` //Inserting doctor's availability in one column
                    }
                    else {
                        schedule += `<td>Not Available</td></tr>` //Inserting doctor's availability in one column
                    }
                    docName = r.dFirstName + ' ' + r.dLastName
                }
                schedule += `Doctor's Name: ` + docName
                schedule += `</table>`  //Ending table
                schedule += `<form action="/">
                                <br/><button>Return to Home Page</button>
                             </form>`   //Adding return to home option
                res.send(schedule); //Sending the table to the client
        })
    }

    //For equipment schedules
    else{
        conn.query(`SELECT * FROM
                    (SELECT equipmentID, equipmentType, sTime, availability FROM medicalequipment NATURAL JOIN equipmentschedule) AS eSchedule
                    WHERE Date(sTime) = ${date} 
                    AND equipmentID = ${req.body.sId}
                    ORDER BY availability;` //Query
            ,(err,rows,fields) =>{

                schedule += `<table style="width:100%">`    //Formatting table
                schedule += `<tr><th>Operating Times</th><th>Availability</th></tr>` //Formatting table headers
                let equipType = '';
                for(r of rows){
                    let time = String(r.sTime); //Formatting time
                    time= time.substring(time.indexOf(':') - 2, time.indexOf('G')); //Formatting time more
                    schedule += `<td> ${time} </td>`    //Inserting the time in one column
                    if (r.availability == 1) {
                        schedule += `<td>Available</td></tr>` //Inserting equipment's availability in one column
                    }
                    else {
                        schedule += `<td>Not Available</td></tr>` //Inserting equipment's availability in one column
                    }
                    equipType = r.equipmentType
                }
                schedule += `Equipment Type: ` + equipType
                schedule += `</table>`  //Ending table
                schedule += `<form action="/">
                                <br/><button>Return to Home Page</button>
                             </form>`   //Adding return to home option
                res.send(schedule); //Sending the table to the client
        })
    }
    conn.end(); //ending connection
})

//Get method which opens up the page for displaying a list of a certain doctor's patients
app.get('/DisplayPatientsByDoctor', (req, res) => {
    res.sendFile('staticContent/displayPatientsByDoctor.html', { root: __dirname })
})

//Post method to generate the list of patients to be displayed
app.post('/viewPatients', (req, res) => {
    let conn = newConnection();
    conn.connect(); //Establshing connection
    let list = `<h2> List of Patient Information for Doctor ID #${req.body.doctorID}</h2><br/>` //Header
    list += `<style>
    table, th, td {
        border: 1px solid black;
      } </style>`;  //table styling

    //Create View statement (it will always be replaced later on)
    conn.query(`CREATE OR REPLACE VIEW doctorPatients AS \n` + 
                `SELECT p.pFirstName, p.pLastName, p.healthCardNo, p.sex, p.DOB \n` + 
                `FROM patient p \n` + 
                `WHERE p.doctorID = ${req.body.doctorID}`  
            ,(err,rows,fields) => {
                if(err) {
                    console.log(err);
                }
            })
    
    //Query to select everything from the created view
    conn.query(`SELECT * FROM doctorPatients` 
        ,(err,rows,fields) =>{
            if (err){
                console.log(err);
            }
            else {
                list += `<table style="width:100%">`    //Formatting table
                list += `<tr><th>First Name</th><th>Last Name</th><th>Health Card Number</th><th>Sex</th><th>Date Of Birth</th></tr>`   //Formatting table columns
                for(r of rows){
                    let dob = String(r.DOB);    //Formatting date of birth
                    dob = dob.substring(4,15);  //Formatting date of birth more

                    list += `<tr><td> ${r.pFirstName} </td>`    //Inserting patient's first name into one column
                    list += `<td> ${r.pLastName} </td>` //Inserting patient's last name into one column
                    list += `<td> ${r.healthCardNo} </td>`  //Inserting patient's health card number into one column
                    list += `<td> ${r.sex} </td>`   //Inserting patient's sex into one column
                    list += `<td>` + dob + `</td></tr>` //Inserting patient's date of birth into one column
                }
                list += `</table>`  //Ending table
                list += `<form action="/">
                                <br/><button>Return to Home Page</button>
                            </form>`    //Adding return to home option
                res.send(list); //Sending the table to the client
            }
    })
    conn.end(); //Ending connection
});

//Get method which opens up the page for calculating the cost of a reservation
app.get('/CalcReservationCost', (req,res) => {
    res.sendFile('staticContent/calcReservationCost.html', {root: __dirname })
})

//Post method to calculate the cost of a reservation
app.post('/calculateCost', (req, res) => {
    let conn = newConnection();
    conn.connect(); //establishing connection
    let cost = 0;   //holds the cost

    //Query to Select the SUM of each component of a reservation and put it into its own table called total
    conn.query(`SELECT SUM(equipmentCost + roomCost + 200) AS total \n` +
             `FROM room, medicalEquipment \n` +
             `WHERE roomNo = ${req.get("roomNo")} AND equipmentID = ${req.get("equipmentID")}`  //Query
        ,(err,rows,fields) => {
            if(err) {
                console.log(err);
            }
            else {
                for (let r of rows) {
                    cost += r.total;    //Adding single row of the Total column to cost
                }
                if (cost>0)
                    res.send("Your computed cost for any reservation concerning that room and piece of equipment is $" + cost.toFixed(2));  //Sends message to client saying they entered an illegal value
                else
                    res.send("Sorry, but one or more of your inputs were illegal at this time");    //Sends cost to client
            }
        });
    conn.end(); //Ends the connection
})

//Get method which opens up the page for displaying various reservations
app.get('/DisplayReservation', (req,res) => {
    res.sendFile('staticContent/displayReservations.html', {root: __dirname })
})

//Post method to generate the list of reservations
app.post('/displayReservations', (req,res) => {
    let conn = newConnection();
    conn.connect(); //Establishing connection
    let content = '';

    let date = req.get('resDate');  //Formatting date
    date = date.substring(0,date.indexOf('-')) + date.substring(date.indexOf('-') + 1, date.indexOf('-' ,date.indexOf('-') + 1)) + date.substring(date.indexOf('-' ,date.indexOf('-') + 1) + 1);    //Formatting date more
    
    //Query to select information from the Doctor and Reservation table and join them
    conn.query(`SELECT d.dFirstName, d.dLastName, d.specialty, r.* 
        FROM Doctor d
        JOIN Reservation r ON d.doctorID = r.doctorID
        WHERE Date(sTime ) = '${date}' 
        `     
        ,(err,rows,fields) => {
            if(err) {
                console.log(err);
            } else {
                content += `<table style = "width:100%">`   //Formatting table
                content += `<tr><th>DoctorID</th><th>First Name</th><th>Last Name</th><th>Specialty</th><th>Appointment Time</th><th>Room No.</th><th>Priority</th><th>Equipment No.</th></tr>` //Formatting table headers
                for (r of rows) {
                    content += `<div>`
                    content += `<tr>`
                    content += `<td> ${r.doctorID}</td>`    //Inserting doctor's ID into one column
                    content += `<td> ${r.dFirstName}</td>`  //Inserting doctor's first name into one column
                    content += `<td> ${r.dLastName}</td>`   //Inserting doctor's last name into one column
                    content += `<td> ${r.specialty}</td>`   //Inserting doctor's specialty into one column
                    content += `<td> ${r.sTime}</td>`   //Inserting the reservation's datetime into one column
                    content += `<td> ${r.roomNo}</td>`  //Inserting the room number into one column
                    content += `<td> ${r.priority}</td>`    //Inserting the patient's priority into one column
                    content += `<td> ${r.equipmentID}</td>` //Inserting the equipment ID into one column
                    content += `<tr>`
                    content += `</div>`
                }
                content += `</table>`   //Ending table
            }
            res.send(content)   //Sending the table to the client
        }
    )
    conn.end(); //Ending the connection
})

//Get method which opens up the page for inserting a patient into the database
app.get('/InsertPatient', (req,res) => {
    res.sendFile('staticContent/insertPatient.html', {root: __dirname })
})

//Post method which insert's a patient into the database
app.post('/insertPatient', (req, res) => {
    let conn = newConnection();
    conn.connect(); //establishing connection

    let content = '';

    //Modification to insert into the Patient table with the inputted values
    conn.query(`INSERT INTO Patient VALUES (
        '${req.get("healthCardNo")}', '${req.get("pFirstName")}', '${req.get("pLastName")}', ${req.get("dob")}, '${req.get("sex")}', ${req.get("doctorID")})`
        , (err, rows, fields) => {

        if(err) {
            content += '<br>One or more value(s) inputted are invalid or duplicated';
            console.log(err)
            res.send(content);  //Sends a message saying input was invalid
        }
        else {
            //Formatting date of birth
            let dateOfBirth = req.get("dob");
            let year = dateOfBirth.substring(0,4);
            let month = dateOfBirth.substring(4,6);
            let day = dateOfBirth.substring(6,8);

            //Formatting how the patient information is going to appear to the client
            content += '<div>';
            content += '<br>Patient was added, review patient details below'
            content += '<br><br>'
            content += 'Name: ' + req.get("pFirstName") + ' ' + req.get("pLastName") + '<br>'
            content += 'Health Card Number: ' + req.get("healthCardNo") + '<br>'
            content += 'Date of Birth (YYYY/MM/DD): ' + year + '/' + month + '/' + day + '<br>'
            content += 'Sex: ' + req.get("sex")
            content += '</div>';

            res.send(content);  //Sending patient information to client
        }
    });
    
    conn.end(); //Ending connection
})

app.use(express.static('staticContent'));   //where HTML pages are

//Displays what port the server is listening on
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});