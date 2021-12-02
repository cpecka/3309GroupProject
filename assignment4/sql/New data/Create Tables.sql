USE hospitalAdmin;

CREATE TABLE Doctor (
	 doctorID int NOT NULL, 
	 dFirstName varchar(10) NOT NULL, 
	 dLastName varchar(10) NOT NULL, 
	 specialty varchar(10), 
	 PRIMARY KEY (doctorID));
    
 CREATE TABLE Room (
	 roomNo int NOT NULL, 
     hospitalWing varchar(2) NOT NULL,
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
	 sTime datetime NOT NULL,
     roomNo int NOT NULL,
     availability bool NOT NULL,
     PRIMARY KEY (sTime, roomNo),
     FOREIGN KEY (roomNo) References Room(roomNo) ON UPDATE CASCADE ON DELETE CASCADE);
    
CREATE TABLE EquipmentSchedule (
	 sTime datetime NOT NULL,
     equipmentID int NOT NULL,
     availability bool NOT NULL,
     PRIMARY KEY (sTime, equipmentID),
     FOREIGN KEY (equipmentID) References MedicalEquipment(equipmentID) ON UPDATE CASCADE ON DELETE CASCADE);
    
CREATE TABLE StaffSchedule (
	sTime datetime NOT NULL,
    doctorID int NOT NULL,
    shift int NOT NULL,
    availability bool,
    PRIMARY KEY (sTime, doctorID),
    FOREIGN KEY (doctorID) References Doctor(doctorID) ON UPDATE CASCADE ON DELETE CASCADE);

CREATE TABLE Reservation (
	sTime datetime NOT NULL,
    doctorID int NOT NULL,
    roomNo int NOT NULL,
    priority varchar(10) NOT NULL,
    equipmentID int NOT NULL,
    PRIMARY KEY (sTime, doctorID),
    FOREIGN KEY (sTime, equipmentID) References EquipmentSchedule(sTime, equipmentID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (sTime, doctorID) References StaffSchedule(sTime, doctorID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (sTime, roomNo) References RoomSchedule(sTime, roomNo) ON UPDATE CASCADE ON DELETE CASCADE);
    

    
    
    





    
    
    
    
    
    

    

    
    
    

    

