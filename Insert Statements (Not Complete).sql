INSERT INTO Room VALUES
(
	43,
    '6TK',
    '250.00'
);

INSERT INTO Doctor
(
	doctorID,
    dFirstName,
    dLastName
) VALUES 
(
	79,
    'Colin'
    'Pecka'
);

INSERT INTO Reservation
( 
	doctorID
) 
	SELECT doctorID 
    FROM Doctor;



