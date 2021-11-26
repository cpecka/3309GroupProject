USE hospitalAdmin;
SET SQL_SAFE_UPDATES = 0;

DELETE FROM Room rm 
	WHERE rm.roomNo NOT IN 
		(SELECT r.roomNo FROM Reservation r) AND hospitalWing = “Z1”;

UPDATE Room
	SET roomCost = 
		(SELECT AVG(equipmentCost)
		FROM MedicalEquipment
		WHERE equipmentType = "Scalpel")
	WHERE hospitalWing = "C1";

UPDATE Reservation
	SET appointmentTime = SUBTIME(appointmentTime, '1:00')
	WHERE priority = 'emergency' OR priority = 'critical';


