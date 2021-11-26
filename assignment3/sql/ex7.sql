USE hospitalAdmin;

CREATE VIEW ReservationsPerRoom AS 
	(SELECT rm.roomNo, hospitalWing, COUNT(*) 
	FROM Room rm, Reservation r 
	WHERE rm.roomNo = r.roomNo
GROUP BY rm.roomNo, hospitalWing)
UNION 
	(SELECT roomNo, hospitalWing, 0
	FROM Room rm
	WHERE NOT EXISTS 
		(SELECT *
		FROM Reservation r
		WHERE r.RoomNo = rm.roomNo));

SELECT * FROM ReservationsPerRoom;

CREATE VIEW Pediatrics AS
	SELECT d.*
	FROM Doctor d
	WHERE specialty = "pediatrics"
GROUP BY doctorID;

SELECT * FROM Pediatrics;

CREATE VIEW franksPatients AS
	SELECT d.dFirstName, d.dLastName, p.pFirstName, p.pLastName, p.healthCardNo
	FROM patient p, doctor d
	WHERE p.doctorID = d.doctorID AND p.doctorID = '5';

SELECT * FROM franksPatients;


