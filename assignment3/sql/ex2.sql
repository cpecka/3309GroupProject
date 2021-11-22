CREATE DATABASE hospitalAdmin;
USE hospitalAdmin;


CREATE TABLE Doctor (
	 doctorID int NOT NULL, 
	 dFirstName varchar(20) NOT NULL, 
	 dLastName varchar(20) NOT NULL, 
	 specialty varchar(10), 
	 PRIMARY KEY (doctorID));
    
 CREATE TABLE Room (
	 roomNo int NOT NULL, 
     hospitalWing varchar(20) NOT NULL,
     roomCost double NOT NULL,
     PRIMARY KEY (roomNo));
    
 CREATE TABLE MedicalEquipment (
	 equipmentID int NOT NULL,
     equipmentType varchar(20) NOT NULL,
     equipmentCost double NOT NULL,
     PRIMARY KEY (equipmentID));
    

CREATE TABLE Patient (
	 healthCardNo varchar(15) NOT NULL,
     pFirstName varchar(20) NOT NULL,
     pLastName varchar(20) NOT NULL,
     DOB date NOT NULL,
     sex varchar(1) NOT NULL,
     doctorID int NOT NULL,
     PRIMARY KEY (healthCardNo),
     FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID) ON UPDATE CASCADE ON DELETE CASCADE);
    
CREATE TABLE RoomSchedule (
	 sDate date NOT NULL,
     roomNo int NOT NULL,
     availability1 bool NOT NULL,
     availability2 bool NOT NULL,
     availability3 bool NOT NULL,
     availability4 bool NOT NULL,
     availability5 bool NOT NULL,
     availability6 bool NOT NULL,
     availability7 bool NOT NULL,
     availability8 bool NOT NULL,
     availability9 bool NOT NULL,
     availability10 bool NOT NULL,
     availability11 bool NOT NULL,
     availability12 bool NOT NULL,
     PRIMARY KEY (sDate, roomNo),
     FOREIGN KEY (roomNo) References Room(roomNo) ON UPDATE CASCADE ON DELETE CASCADE);
    
CREATE TABLE EquipmentSchedule (
	 sDate date NOT NULL,
     equipmentID int NOT NULL,
     availability1 bool NOT NULL,
	 availability2 bool NOT NULL,
	 availability3 bool NOT NULL,
	 availability4 bool NOT NULL,
	 availability5 bool NOT NULL,
	 availability6 bool NOT NULL,
	 availability7 bool NOT NULL,
	 availability8 bool NOT NULL,
     availability9 bool NOT NULL,
     availability10 bool NOT NULL,
     availability11 bool NOT NULL,
     availability12 bool NOT NULL,
     PRIMARY KEY (sDate, equipmentID),
     FOREIGN KEY (equipmentID) References MedicalEquipment(equipmentID) ON UPDATE CASCADE ON DELETE CASCADE);
    
CREATE TABLE StaffSchedule (
	sDate date NOT NULL,
    doctorID int NOT NULL,
    shiftStart time NOT NULL,
    availability1 bool,
	availability2 bool,
	availability3 bool,
	availability4 bool,
	availability5 bool,
	availability6 bool,
	availability7 bool,
	availability8 bool,
    availability9 bool,
    availability10 bool,
    availability11 bool,
	availability12 bool,
    PRIMARY KEY (sDate, doctorID),
    FOREIGN KEY (doctorID) References Doctor(doctorID) ON UPDATE CASCADE ON DELETE CASCADE);

CREATE TABLE Reservation (
	sDate date NOT NULL,
    appointmentTime time NOT NULL,
    doctorID int NOT NULL,
    roomNo int NOT NULL,
    priority varchar(10) NOT NULL,
    equipmentID int NOT NULL,
    PRIMARY KEY (sDate, appointmentTime, doctorID),
    FOREIGN KEY (sDate, equipmentID) References EquipmentSchedule(sdate, equipmentID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (sDate, doctorID) References StaffSchedule(sDate, doctorID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (sDate, roomNo) References RoomSchedule(sDate, roomNo) ON UPDATE CASCADE ON DELETE CASCADE);





    
    
    
    
    
    

    

    
    
    

    
