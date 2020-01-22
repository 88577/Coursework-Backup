package Controllers;

import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Time;
import java.util.UUID;

@Path("ScheduleController/")


public class ScheduleController {

        @POST
        @Path("InsertBookingTiming")
        @Consumes(MediaType.MULTIPART_FORM_DATA)
        @Produces(MediaType.APPLICATION_JSON)
        public static String InsertBookingTiming(
                @FormDataParam("bookingID") Integer bookingID,
                @FormDataParam("day") String day,
                @FormDataParam("time") Integer time){
            try {
                if(bookingID == null || day == null || time == null){
                    // Check that no value is null
                    throw new Exception("One or more form data parameters are missing from the HTTP request");
                }
                System.out.println("InsertBookingTiming");
                boolean running = true;
                PreparedStatement ps1 = Main.db.prepareStatement("INSERT INTO Schedule (bookingID, day, time) VALUES (?, ?, ?)");
                ps1.setInt(1,bookingID);
                ps1.setString(2, day);
                ps1.setInt(3, time);

                PreparedStatement ps2 = Main.db.prepareStatement("SELECT * FROM Schedule");
                ResultSet results = ps2.executeQuery();
                while ((results.next()) && (running == true)){
                    int bookingID2 = results.getInt(1);
                    String day2 = results.getString(2);
                    int time2 = results.getInt(3);

                    if ((day2.equals(day)) && (time2 == time)){
                        if ((CourtController.CheckConflictingBookings(bookingID, bookingID2)) == true){
                            running = false;
                        }
                    }
                }
                if(running == true){
                    System.out.println("Court conflict not found");
                    ps1.executeUpdate();
                    System.out.println("Records successfully added");
                }else {
                    System.out.println("Court conflict found");
                    System.out.println("Records not added");
                }
                return "{\"status\": \"OK\"}";
            }catch (Exception e){
                System.out.println("Error " + e.getMessage());
                return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
            }
        }
        @GET
        @Path("ListBookingTiming/{bookingID}")
        @Produces(MediaType.APPLICATION_JSON)
        public static String ListBookingTiming(@PathParam("bookingID") Integer bookingID){
            try {
                System.out.println("ScheduleController/ListBookingTiming/ " + bookingID);

                JSONArray list = new JSONArray();

                PreparedStatement ps = Main.db.prepareStatement("SELECT day, time FROM Schedule WHERE bookingID = ?");
                ps.setInt(1, bookingID);
                ResultSet results = ps.executeQuery();
                while(results.next()){
                    JSONObject item = new JSONObject();
                    item.put("day", results.getInt(1));
                    item.put("time", results.getInt(2));
                    list.add(item);
                }
                return list.toString();
            }catch (Exception e){
                System.out.println("Error " + e.getMessage());
                return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
            }
        }
    @GET
    @Path("ListFreeplayBookingTiming/{bookingID}")
    @Produces(MediaType.APPLICATION_JSON)
    public static String ListFreeplayBookingTiming(@PathParam("bookingID") Integer bookingID){
        try {
            System.out.println("ScheduleController/ListFreeplayBookingTiming/ " + bookingID);
            JSONObject item = new JSONObject();

            PreparedStatement ps = Main.db.prepareStatement("SELECT day, time FROM Schedule WHERE bookingID = ?");
            ps.setInt(1, bookingID);
            ResultSet results = ps.executeQuery();

            item.put("day", results.getInt(1));
            item.put("time", results.getInt(2));

            return item.toString();
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());
            return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
        }
    }

        @GET
        @Path("ListDaysBookings/{day}")
        @Produces(MediaType.APPLICATION_JSON)

        public static String ListDaysBookings(@PathParam("day") String day) throws Exception{
            if(day == null){
                throw new Exception("day is missing from HTTP request");
            }
            System.out.println("ScheduleController/ListDaysBookings " + day);

            JSONArray list = new JSONArray();

            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT bookingID, time FROM Schedule WHERE day = ?");
                ps.setString(1, day);
                ResultSet results = ps.executeQuery();
                while(results.next()){
                    JSONObject item = new JSONObject();
                    item.put("bookingID", results.getInt(1));
                    item.put("time", results.getInt(2));
                    list.add(item);
                }
                return list.toString();
            }catch (Exception e){
                System.out.println("Database Error " + e.getMessage());
                return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
            }
        }
        public static void ListTimesBooking(String day, int time){
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT bookingID FROM Schedule WHERE day = ? AND time = ?");
                ps.setString(1, day);
                ps.setInt(2, time);
                ResultSet results = ps.executeQuery();
                while (results.next()){
                    int bookingID = results.getInt(1);
                    System.out.println(bookingID);
                }
            }catch (Exception e){
                System.out.println("Error " + e.getMessage());
            }
        }

    @GET
    @Path("ListAllBookings")
    @Produces(MediaType.APPLICATION_JSON)
    public static String ListAllBookings(){
        System.out.println("ScheduleController/ListAllBookings");
        JSONArray list = new JSONArray();

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT bookingID, time, day FROM Schedule");
            ResultSet results = ps.executeQuery();

            while (results.next()){
                JSONObject item = new JSONObject();
                item.put("bookingID", results.getInt(1));
                item.put("time", results.getString(2));
                item.put("day", results.getInt(3));
                list.add(item);
            }
            return list.toString();
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());
            return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
        }
    }

}
