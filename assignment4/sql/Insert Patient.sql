USE hospitalAdmin;

INSERT INTO Patient (
	healthCardNo,
	pFirstName,
	pLastName,
	DOB,
	sex,
	doctorID
) VALUES (
	'1A2B3C4D5E6F7G8',
	'John',
	'Smith',
	20020610,
	'M',
	13
);

-- The data above will return a non-trivial response when inputted into the web form, the data below will also work.

/*
healthCardNo = '1C6B3C5A5E6L8G9'
pFirstName = 'Matthew'
pLastName = 'Booker'
DOB = 19750126
sex = 'M'
doctorID = 21

healthCardNo = '9C2M3C5ADE6N3G1'
pFirstName = 'Lily'
pLastName = 'Brooks'
DOB = 19821020
sex = 'F'
doctorID = 34
*/
        