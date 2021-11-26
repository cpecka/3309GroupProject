INSERT INTO Room VALUES
(
	101,
    'A1',
    '256.43'
);

INSERT INTO Doctor
(
	doctorID,
    dFirstName,
    dLastName,
    specialty
) VALUES 
(
	101,
    'Colin',
    'Pecka',
    'Medicine'
);

INSERT INTO RoomSchedule
	VALUES ('2021-12-06',
    (SELECT roomNo
		FROM Room
        WHERE roomNo = 1),
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)




