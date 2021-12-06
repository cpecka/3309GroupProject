USE hospitalAdmin;

-- Because our view will consistently be replaced due to the WHERE clause and is only accessed in this functionality, I am putting it in this file instead of the file where we created our tables
CREATE OR REPLACE VIEW doctorPatients AS
SELECT p.pFirstName, p.pLastName, p.healthCardNo, p.sex, p.DOB
FROM patient p
WHERE p.doctorID = 5;

SELECT * FROM doctorPatients;

-- Entering the value from the WHERE clause above in the textbox for this functionality will result in a non-trivial response