USE hospitalAdmin;

/*
Values to input for non trival output in display reservation functionality
    Dec 13, 2021
    Dec 14, 2021
	
*/
 
/* 
Gets all the reservations on Dec 13, 2021

SELECT d.dFirstName, d.dLastName, d.specialty, r.*
FROM Doctor d
JOIN Reservation r ON d.doctorID = r.doctorID
WHERE Date(sTime) = '2021-12-13'
*/

/* 
Gets all the reservations on Dec 14, 2021

SELECT d.dFirstName, d.dLastName, d.specialty, r.*
FROM Doctor d
JOIN Reservation r ON d.doctorID = r.doctorID
WHERE Date(sTime) = '2021-12-14'
*/