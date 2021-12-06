USE hospitalAdmin;

SELECT SUM(roomCost + equipmentCost + 200) AS total
FROM room, medicalEquipment
WHERE roomNo = 6 AND equipmentID = 18;

-- Entering the two values from the WHERE clause above in the two textboxes for this functionality will result in a non-trivial response