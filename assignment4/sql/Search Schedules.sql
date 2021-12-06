/*
These are the values to input for a non trivial output from the query
These values are for the Search Schedules Functionality
*/

/*
This query selects all values from the joined table of Doctor and staffschedule where the date is 2021-12-15 and the doctorID is 1
The current database does not have doctors with id's > 50  and only contains dates from 2021-12-13 - 2021-12-17
*/
SELECT * FROM 
(SELECT * FROM Doctor NATURAL JOIN staffschedule) AS doctorSchedule
WHERE Date(sTime) = 20211215 
AND doctorID = 1 
ORDER BY availability;

/*
This query selects all values from the roomschedule where the date is 2021-12-15 and the roomNo is 1
The current database does not have room numbers > 50  and only contains dates from 2021-12-13 - 2021-12-17
*/
SELECT * FROM roomschedule 
WHERE Date(sTime) = 20211215 
AND roomNo = 1 
ORDER BY availability;

/*
This query selects all values from the joined table of medicalequipment and equipmentschedule where the date is 2021-12-15 and the equipmentID is 1
The current database does not have equipment with id's > 200  and only contains dates from 2021-12-13 - 2021-12-17
*/
SELECT * FROM
(SELECT equipmentID, equipmentType, sTime, availability FROM medicalequipment NATURAL JOIN equipmentschedule) AS eSchedule
WHERE Date(sTime) = 20211215 
AND equipmentID = 1
ORDER BY availability;