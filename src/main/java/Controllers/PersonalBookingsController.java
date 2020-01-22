package Controllers;

import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import javax.print.attribute.standard.Media;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.awt.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("PersonalBookingsController/")
public class PersonalBookingsController {
    @GET
    @Path("ListAllUsersBookings")
    @Produces(MediaType.APPLICATION_JSON)
    public static String ListAllUsersBookings(){
        System.out.println("PersonalBookingsController/ListAllUsersBookings");
        JSONArray list = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID, bookingID FROM personalBookings");
            ResultSet results = ps.executeQuery();
            while(results.next()){
                JSONObject item = new JSONObject();
                item.put("userID", results.getInt(1));
                item.put("bookingID", results.getInt(2));
                list.add(item);
            }
            return list.toString();
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());
            return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
        }
    }
    @GET
    @Path("ListAllUserBookings/{userID}")
    @Produces(MediaType.APPLICATION_JSON)
    public String ListAllUserBookings(@PathParam("userID") Integer userID) throws Exception{
        if(userID == null){
            throw new Exception("User ID is missing from HTTP request");
        }
        System.out.println("PersonalBookingsController/ListAllUserBookings" + userID);

        try {
            JSONArray list = new JSONArray();
            PreparedStatement ps = Main.db.prepareStatement("SELECT personalBookings.bookingID, Bookings.description, Bookings.bookingType FROM personalBookings LEFT JOIN Bookings ON personalBookings.bookingID = Bookings.bookingID WHERE userID = ?");
            ps.setInt(1, userID);
            ResultSet results = ps.executeQuery();
            while (results.next()){
                JSONObject item = new JSONObject();
                item.put("bookingID", results.getInt(1));
                item.put("description", results.getString(2));
                item.put("bookingType", results.getInt(3));
                list.add(item);
            }
            return list.toString();
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());
            return "{\"error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }
    public static void ListBookingsUsers(int bookingID){
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID FROM personalBookings WHERE bookingID = ?");
            ps.setInt(1, bookingID);
            ResultSet results = ps.executeQuery();
            while (results.next()){
                int userID = results.getInt(1);
                System.out.println(userID);
            }
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());

        }
    }
    @POST
    @Path("InsertUserBookings")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public static String InsertUserBooking(
            @FormDataParam("userID") Integer userID,
            @FormDataParam("bookingID") Integer bookingID){
        try {
            if (userID == null || bookingID == null){
                throw new Exception("One or more form data parameters are missing from the HTTP request");
            }
            System.out.println("InsertUserBookings/userID=" + userID);
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO personalBookings (userID, bookingID) values (?, ?)");

            ps.setInt(1, userID);
            ps.setInt(2, bookingID);
            ps.execute();
            return "{\"status\": \"OK\"}";
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());
            return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }



    public static void DeleteAllUsersBooking(int userID){
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM personalBookings WHERE userID = ?");
            ps.setInt(1, userID);
            ps.executeUpdate();
            System.out.println("Records successfully removed");
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());
        }
    }
    @POST
    @Path("DeleteUsersBooking")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public static String DeleteUsersBooking(
            @FormDataParam("userID") Integer userID,
            @FormDataParam("bookingID") Integer bookingID){
        try {
            if(userID == null){
                throw new Exception("One or more form data parameters are missing in the HTTP request");
            }
            System.out.println("PersonalBookingsController/DeleteUsersBooking userID=" + userID);

            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM personalBookings WHERE userID = ? and bookingID = ?");
            ps.setInt(1, userID);
            ps.setInt(2, bookingID);
            ps.executeUpdate();

            PreparedStatement ps2 = Main.db.prepareStatement("DELETE FROM Schedule WHERE bookingID = ?");
            ps2.setInt(1, bookingID);
            ps2.executeUpdate();

            PreparedStatement ps3 = Main.db.prepareStatement("DELETE FROM Bookings WHERE bookingID = ?");
            ps3.setInt(1, bookingID);
            ps3.executeUpdate();

            return "{\"status\": \"OK\"}";
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());
            return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
    @POST
    @Path("DeleteUsersExistingBooking")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public static String DeleteUsersExistingBooking(
            @FormDataParam("userID") Integer userID,
            @FormDataParam("bookingID") Integer bookingID){
        try {
            if(userID == null){
                throw new Exception("One or more form data parameters are missing in the HTTP request");
            }
            System.out.println("PersonalBookingsController/DeleteUsersExistingBooking userID=" + userID);

            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM personalBookings WHERE userID = ? and bookingID = ?");
            ps.setInt(1, userID);
            ps.setInt(2, bookingID);
            ps.executeUpdate();

            return "{\"status\": \"OK\"}";
        }catch (Exception e){
            System.out.println("Error " + e.getMessage());
            return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
}
