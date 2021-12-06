/*
Values to input for non trival output in generate reservation functionality

	Reservation Date: December 13, 2021 6:00am
	Doctor ID: 17
	Wing: D1
	Equipment: Surgical Table
    Priority: very low
*/
USE hospitalAdmin;
#finds if relavant doctor is available
/*SELECT availability From StaffSchedule
Where (doctorID = 17 AND sTime = '2021-12-13 06:00:00')
*/

#finds rooms in the wing available at that time
/*SELECT rs.roomNo From RoomSchedule rs
Where (SELECT r.roomNo FROM ROOM r
Where (rs.sTime = '2021-12-13 06:00:00' AND rs.availability = true AND r.hospitalWing = 'D1' AND r.roomNo = rs.roomNo))
*/

#finds the correct medical equipment available at that time
/*SELECT es.equipmentID from EquipmentSchedule es
Where (Select me.equipmentID from MedicalEquipment me
Where (es.sTime = '2021-12-13 06:00:00' AND es.availability = true AND me.equipmentType = 'Surgical Table' AND me.equipmentID = es.equipmentID))
*/

#Makes Doctor 17 Unavailable at the given time
/*Update StaffSchedule 
Set availability = true 
Where(sTime = '2021-12-13 06:00:00' AND doctorID = 17)
*/

#Makes Room 29 Unavailable at the given time
/*Update RoomSchedule 
Set availability = true 
Where(sTime = '2021-12-13 06:00:00' AND roomNo = 29)
*/

#Makes equipment 3 Unavailable at the given time
/*Update EquipmentSchedule 
Set availability = true 
Where(sTime = '2021-12-13 06:00:00' AND equipmentID = 3)
*/



#Makes new reservation for date with doctor 17 in room 29 with equipment 3
#INSERT INTO Reservation VALUES ('2021-12-13 06:00:00', 17, 29, 'very low', 3);







