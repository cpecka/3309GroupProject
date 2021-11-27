package SE3309; //can be replaced depending on the IDE you use

//import statements
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

public class Main {

    public static void main(String[] args) {

        int roomNo=1;   //holds roomNumber (primary key of room)
        int equipmentID = 1;    //holds equipment id (primary key of medical equipment)
        int doctorID = 1;   //holds doctor id (primary key of doctor)

        //random variables for getting random data
        Random r1 = new Random();
        Random r2 = new Random();
        Random r3 = new Random();
        Random r4 = new Random();

        LocalDate bFrom = LocalDate.of(1920, 1, 1); //beginning date for date of birth (patient)
        LocalDate bTo = LocalDate.of(2020,1,1); //ending date for date of birth (patient)
        long bDays = bFrom.until(bTo, ChronoUnit.DAYS); //used for getting a date within the two dates above

        LocalDate rFrom = LocalDate.of(2021, 12, 1);    //beginning date for appointment date (reservation)
        LocalDate rTo = LocalDate.of(2021,12,5);    //ending date for appointment date (reservation)
        long rDays = rFrom.until(rTo, ChronoUnit.DAYS); //used for getting a date within the two dates above

        //holds many possible wings
        String[] wings = {"A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2"};

        //holds many possible equipment types
        String[] equipmentType = {"Hospital Bed", "Wheelchair", "Defibrillator", "Surgical Table", "Lift", "X-Ray", "MRI Machine", "Stethoscope", "Pacemaker", "Heart Rate Monitor", "Scalpel", "Forceps"};

        //holds doctor first names, last names, and specialties
        String[] dFirstNames = {"Mike", "Dick", "Jason", "Freddy", "John", "Mickey", "David", "Frank", "Haley", "Vanessa", "Joan", "Kaycee", "Angela", "Chloe", "Nicole", "Gabby"};
        String[] dLastNames = {"Smith", "Jones", "Taylor", "Brown", "Adams", "Wilson", "Davis", "Miller"};
        String[] specialties = {"Medicine", "Neurology", "Pathology", "Pediatrics", "Psychiatry", "Radiation", "Surgery", "Urology"};

        //holds patient first names and last names
        String[] pFirstNames = {"James", "Robert", "Will", "Rich", "Thomas", "Dave","Andrew", "Joshua", "Mary", "Sarah", "Linda", "Sydney", "Karen", "Nancy", "Betty", "Ashley"};
        String[] pLastNames = {"Allen", "Bailey", "Baker", "Barnes", "Carter", "Pearce", "Perry", "Rogers"};

        //holds possible priorities for reservations
        String[] priorities = {"very low", "standard", "important", "critical", "emergency"};

        //used to ensure that the health cards generated (for patients) are all unique
        ArrayList<String> healthCards = new ArrayList<>();

        //This next bit generates data for each relation to be used in the DB, and stores it into a unique txt file based on its relation name
        //In addition to the constant variables above (primary keys), the random numbers are used to determine certain values and also determine what values from the arrays above will be used in a certain tuple
        //To keep things simple, the three primary keys defined above (doctorID, equipmentID, roomNo) will increment by 1 each time
        //ALL data in the text files will show up as "INSERT INTO (Relation Name) Values ("data......")
        //This will ensure that in order to insert the data into mysql, you just need to add a USE (name of database) statement, and copy and paste the contents of each file into a mysql editor, then execute it
        //PAY VERY CLOSE ATTENTION TO THE FINAL DATA GENERATION STEP (RESERVATIONS), THERE IS SOMETHING VERY IMPORTANT HERE!!!

        //Generates the data needed for rooms (100 tuples)
        try {
            FileWriter myWriter = new FileWriter("RoomData.txt");
            for (int i=0;i<100;i++){
                double c = Math.round((r1.nextDouble() * 200 + 100) * 100.0) / 100.0;
                int wing = r2.nextInt(10);
                myWriter.write("INSERT INTO Room VALUES (" + roomNo + ", " + "\'" + wings[wing] + "\', " + c + ");\n");
                roomNo ++;
            }
            myWriter.close();
        } catch(IOException e){
            System.out.println("An error has occurred");
        }

        //Generates the data needed for medical equipment (1000 tuples)
        try {
            FileWriter myWriter2 = new FileWriter("EquipmentData.txt");
            for (int i=0;i<1000;i++){
                double c = Math.round((r1.nextDouble() * 1999900 +100) * 100.0) / 100.0;
                int type = r2.nextInt(12);
                myWriter2.write("INSERT INTO MedicalEquipment VALUES (" + equipmentID + ", " + "\'" + equipmentType[type] + "\', " + c + ");\n");
                equipmentID ++;
            }
            myWriter2.close();
        } catch(IOException e){
            System.out.println("An error has occurred");
        }

        //Generates the data needed for doctors (100 tuples)
        try {
            FileWriter myWriter3 = new FileWriter("DoctorData.txt");
            for (int i=0;i<100;i++){
                int fName = r1.nextInt(16);
                int lName = r2.nextInt(8);
                int spec = r3.nextInt(8);
                myWriter3.write("INSERT INTO Doctor VALUES (" + doctorID + ", " + "\'" + dFirstNames[fName] + "\', \'" + dLastNames[lName] + "\', \'"  + specialties[spec] + "\'" + ");\n");
                doctorID ++;
            }
            myWriter3.close();
        } catch(IOException e){
            System.out.println("An error has occurred");
        }

        //Generates the data needed for patients (1000 tuples)
        try {
            FileWriter myWriter4 = new FileWriter("PatientData.txt");
            for (int i=0;i<1000;i++){
                long randomDays = ThreadLocalRandom.current().nextLong(bDays + 1);
                LocalDate randomDate = bFrom.plusDays(randomDays);
                int fName = r1.nextInt(16);
                int lName = r2.nextInt(8);
                int doctor = r3.nextInt(100) +1;
                if (fName <= 7)
                    myWriter4.write("INSERT INTO Patient VALUES (\'" + getHealthCards(healthCards) + "\', \'" + pFirstNames[fName] + "\', \'" + pLastNames[lName] +  "\', \'" + randomDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "\', \'" +  "M" + "\', " + doctor + ");\n");
                else
                    myWriter4.write("INSERT INTO Patient VALUES (\'" + getHealthCards(healthCards) + "\', \'" + pFirstNames[fName] + "\', \'" + pLastNames[lName] +  "\', \'" + randomDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "\', \'" +  "F" + "\', " + doctor + ");\n");
            }
            myWriter4.close();
        } catch(IOException e){
            System.out.println("An error has occurred");
        }

        //Generates the data needed for the Room Schedule (500 tuples)
        try {
            FileWriter myWriter5 = new FileWriter("RoomSchedule.txt");
            String sourceDate = "2021-12-01";
            SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
            Calendar c = Calendar.getInstance();
            roomNo = 1;
            for (int i = 0; i < 5; i++) {
                for (int j=0;j<100;j++){
                    myWriter5.write("INSERT INTO RoomSchedule VALUES (\'" + sourceDate + "\', " + roomNo + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ");\n");
                    roomNo++;
                }
                roomNo=1;
                try {
                    c.setTime(f.parse(sourceDate));
                    c.add(Calendar.DATE, 1);
                    sourceDate = f.format(c.getTime());
                } catch (ParseException p) {
                    System.out.println("An error has occurred");
                }
            }
            myWriter5.close();
        } catch(IOException e){
            System.out.println("An error has occurred");
        }

        //Generates the data needed for the Equipment Schedule (5000 tuples)
        try {
            FileWriter myWriter6 = new FileWriter("EquipmentSchedule.txt");
            String sourceDate = "2021-12-01";
            SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
            Calendar c = Calendar.getInstance();
            equipmentID = 1;
            for (int i = 0; i < 5; i++) {
                for (int j=0;j<1000;j++){
                    myWriter6.write("INSERT INTO EquipmentSchedule VALUES (\'" + sourceDate + "\', " + equipmentID + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ", " + r1.nextBoolean() + ");\n");
                    equipmentID++;
                }
                equipmentID=1;
                try {
                    c.setTime(f.parse(sourceDate));
                    c.add(Calendar.DATE, 1);
                    sourceDate = f.format(c.getTime());
                } catch (ParseException p) {
                    System.out.println("An error has occurred");
                }
            }
            myWriter6.close();
        } catch(IOException e){
            System.out.println("An error has occurred");
        }

        //Generates the data needed for the Staff Schedule (500 tuples)
        try {
            FileWriter myWriter7 = new FileWriter("StaffSchedule.txt");
            String sourceDate = "2021-12-01";
            SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
            Calendar c = Calendar.getInstance();
            doctorID = 1;
            for (int i = 0; i < 5; i++) {
                for (int j=0;j<100;j++){
                    int shift = r1.nextInt(3);
                    if (shift ==0)
                        myWriter7.write("INSERT INTO StaffSchedule VALUES (\'" + sourceDate + "\', " + doctorID + ", " + shift + ", null" + ", null" + ", null" + ", null" + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ");\n");
                    if (shift ==1)
                        myWriter7.write("INSERT INTO StaffSchedule VALUES (\'" + sourceDate + "\', " + doctorID + ", " + shift + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", null" + ", null" + ", null" + ", null" + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ");\n");
                    if (shift ==2)
                        myWriter7.write("INSERT INTO StaffSchedule VALUES (\'" + sourceDate + "\', " + doctorID + ", " + shift + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", " + r2.nextBoolean() + ", null" + ", null" + ", null" + ", null" + ");\n");
                    doctorID++;
                }
                doctorID=1;
                try {
                    c.setTime(f.parse(sourceDate));
                    c.add(Calendar.DATE, 1);
                    sourceDate = f.format(c.getTime());
                } catch (ParseException p) {
                    System.out.println("An error has occurred");
                }
            }
            myWriter7.close();
        } catch(IOException e){
            System.out.println("An error has occurred");
        }

        //Generates the data needed for Reservations
        //THIS IS IMPORTANT
        try {
            FileWriter myWriter8 = new FileWriter("Reservation.txt");
            for (int i = 0; i < 5; i++) {
                long randomDays = ThreadLocalRandom.current().nextLong(rDays + 1);
                LocalDate randomDate = rFrom.plusDays(randomDays);
                int doctor = r1.nextInt(100) + 1;
                int room = r2.nextInt(100) + 1;
                int priority = r3.nextInt(5);
                int equipment = r4.nextInt(1000) +1;
                myWriter8.write("INSERT INTO Reservation VALUES (\'" + randomDate + "\', " + doctor + ", " + room + ", \'" + priorities[priority] + "\', " + equipment + ");\n");
            }
            myWriter8.close();
        } catch(IOException e){
            System.out.println("An error has occurred");
        }
        //If you look at our Reservation CREATE TABLE statement, you will see that there is supposed to be an appointmentTime variable, which means there should be a time
        //In each of our Schedule classes, there are 12 availability booleans, which each corresponds to a 2hr period over a day (availability 1 = 12:00AM-2:00AM, availability 2 = 2:00AM-4:00AM). The boolean is to determine if that doctor, room, or piece of equipment is available during that time period
        //Since this is for reservations, each of the three ids (doctor, equipment, room) would all need to be available at a certain time of day (at one of the 12 times) on the same day
        //This way, we can make a reservation, and the values of the three booleans will then change to false for that day
        //Unfortunately, since we are generating completely random data, it would be extremely difficult to generate times that work with the data generated in the schedule classes
        //Therefore, for Reservations, we generate the data for everything OTHER than appointment time
        //After everything else is generated, we search through all three schedules to find the tuple containing the generated date and the respective id, and then search through the 12 availabilities for that day
        //Once we find an availability that is false for ALL THREE ids, we know this is a good time (as when a reservation is made, the three availabilities should change to false)
        //We then MANUALLY enter the appointment time into the txt file containing the generated reservation data right after the date, in the form of HH:MM:SS
        //This is why we only have 5 reservations, as it would be extremely tedious to try and do 100!
        //It may have been easier to just manually generate everything for Reservations, but we wanted to compute generate a lot of the stuff
        //We also could have just generated random times, but we wanted the times to make sense with the availabilities
        //THEREFORE, ONCE YOU GENERATE DATA, DO NOT TRY TO INSERT IT INTO A MYSQL EDITOR, AS A NOT NULL PRIMARY KEY WILL BE MISSING! YOU MUST ADD A TIME!!!
    }

    //This method is used to get a random string of length n
    static String getAlphaNumericString(int n)
    {
        //characters will be chosen randomly from this list
        String AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        // create a StringBuffer size of AlphaNumericString
        StringBuilder sb = new StringBuilder(n);

        //generates 15 random characters and appends them all into one string
        for (int i = 0; i < n; i++) {
            int index = (int)(AlphaNumericString.length() * Math.random());
            sb.append(AlphaNumericString.charAt(index));
        }
        //return the generated string
        return sb.toString();
    }

    //This method uses the method above to generate a random health card number
    static String getHealthCards(ArrayList<String> cardNo) {
        String card = ""; //holds the string to be developed

        //keep generating random strings that have not been seen in the array list declared in the scope
        while (true){
            card = getAlphaNumericString(15);   //get a random 15 digit string
            if (!cardNo.contains(card)) {
                cardNo.add(card);   //add the string to the array list declared in the scope if it doesn't exist
                break;
            }
        }
        return card;    //return the health card number
    }
}
