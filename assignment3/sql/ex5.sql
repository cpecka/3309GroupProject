Use hospitaladmin;

SELECT equipmentType, equipmentID FROM MedicalEquipment me
WHERE 
	(SELECT equipmentID 
	FROM EquipmentSchedule es 
	WHERE sDate = 20211204 AND availability4 = false AND availability7 = false AND es.equipmentID = me.equipmentID)
	ORDER BY equipmentType;

SELECT healthCardNo, pFirstName, pLastName FROM Patient p
WHERE 
	(SELECT doctorID FROM Doctor d
	WHERE doctorID = "54" AND p.doctorID = d.doctorID)
	ORDER BY pLastName;

SELECT roomNo, roomCost FROM Room room
WHERE room.roomNo NOT IN
	(SELECT roomNo
	 FROM Reservation res)
ORDER BY roomCost DESC;

SELECT COUNT(*) FROM Patient
WHERE sex = "M" AND DOB < "1960-01-01";

SELECT * FROM Patient p 
WHERE EXISTS
	(SELECT * FROM Doctor d
	WHERE p.doctorID = d.doctorID
	AND 20211123 - p.DOB < 00100000);
    
SELECT d.dFirstName, d.dLastName, d.specialty, r.*
FROM Doctor d
RIGHT JOIN Reservation r ON d.doctorID = r.doctorID
WHERE r.sDate = "2021-12-02";

SELECT * FROM Room rm
JOIN Reservation r 
ON rm.roomNo = r.roomNo
GROUP BY hospitalWing;










