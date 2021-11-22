package SE3309;

import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

public class Main {

    public static void main(String[] args) {

        int roomNo=1;
        int equipmentID = 1;
        int doctorID = 1;
        Random r1 = new Random();
        Random r2 = new Random();
        Random r3 = new Random();
        Random r4 = new Random();

        LocalDate bFrom = LocalDate.of(1920, 1, 1);
        LocalDate bTo = LocalDate.of(2020,1,1);
        long bDays = bFrom.until(bTo, ChronoUnit.DAYS);

        LocalDate rFrom = LocalDate.of(2021, 12, 1);
        LocalDate rTo = LocalDate.of(2021,12,5);
        long rDays = rFrom.until(rTo, ChronoUnit.DAYS);

        String[] wings = {"A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2"};

        String[] equipmentType = {"Hospital Bed", "Wheelchair", "Defibrillator", "Surgical Table", "Lift", "X-Ray", "MRI Machine", "Stethoscope", "Pacemaker", "Heart Rate Monitor", "Scalpel", "Forceps"};

        String[] dFirstNames = {"Mike", "Dick", "Jason", "Freddy", "John", "Mickey", "David", "Frank", "Haley", "Vanessa", "Joan", "Kaycee", "Angela", "Chloe", "Nicole", "Gabby"};
        String[] dLastNames = {"Smith", "Jones", "Taylor", "Brown", "Adams", "Wilson", "Davis", "Miller"};
        String[] specialties = {"Medicine", "Neurology", "Pathology", "Pediatrics", "Psychiatry", "Radiation", "Surgery", "Urology"};

        String[] pFirstNames = {"James", "Robert", "Will", "Rich", "Thomas", "Dave","Andrew", "Joshua", "Mary", "Sarah", "Linda", "Sydney", "Karen", "Nancy", "Betty", "Ashley"};
        String[] pLastNames = {"Allen", "Bailey", "Baker", "Barnes", "Carter", "Pearce", "Perry", "Rogers"};

        String[] priorities = {"very low", "standard", "important", "critical", "emergency"};

        ArrayList<String> healthCards = new ArrayList<>();

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

    }

    static String getAlphaNumericString(int n)
    {

        // chose a Character random from this String
        String AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "0123456789";

        // create StringBuffer size of AlphaNumericString
        StringBuilder sb = new StringBuilder(n);

        for (int i = 0; i < n; i++) {

            // generate a random number between
            // 0 to AlphaNumericString variable length
            int index
                    = (int)(AlphaNumericString.length()
                    * Math.random());

            // add Character one by one in end of sb
            sb.append(AlphaNumericString
                    .charAt(index));
        }

        return sb.toString();
    }

    static String getHealthCards(ArrayList<String> cardNo) {
        String card = "";
        while (true){
            card = getAlphaNumericString(15);
            if (!cardNo.contains(card)) {
                cardNo.add(card);
                break;
            }
        }
        return card;
    }
}
