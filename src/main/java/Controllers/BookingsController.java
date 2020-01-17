package Controllers;

import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import javax.annotation.PostConstruct;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("BookingsController/")
public class BookingsController {

        @POST
        @Path("InsertBookings")
        @Consumes(MediaType.MULTIPART_FORM_DATA)
        @Produces(MediaType.APPLICATION_JSON)
        public static String InsertBookings(
                @FormDataParam("bookingType") Integer bookingType,
                @FormDataParam("description") String description,
                @FormDataParam("slots") Integer slots){
            try{
                if(bookingType == null || description == null || slots == null){
                    throw new Exception("One or more form data parameters are missing from the HTTP request");
                }

                System.out.println("InsertBookings");

                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Bookings (bookingType, description, slots) VALUES (?, ?, ?)");
                ps.setInt(1, bookingType);
                ps.setString(2, description);
                ps.setInt(3, slots);
                ps.executeUpdate();
                return "{\"status\": \"OK\"}";
            }catch (Exception e){
                System.out.println("Error" + e.getMessage());
                return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
            }
        }


        public static void ListAllBookings(){
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT * FROM Bookings");
                ResultSet results = ps.executeQuery();
                while (results.next()){
                    int bookingID = results.getInt(1);
                    int bookingType = results.getInt(2);
                    String description = results.getString(3);
                    int slots = results.getInt(4);
                    System.out.println(bookingID + " " + bookingType + " " + description + " " + slots);
                }
            }catch (Exception e){
                System.out.println("Error" + e.getMessage());
            }
        }

        @GET
        @Path("ListBookings/{bookingID}")
        @Produces(MediaType.APPLICATION_JSON)
        public static String ListBookings(@PathParam("bookingID") Integer bookingID)throws Exception{
                if(bookingID == null){
                    throw new Exception("bookingID is missing from HTTP request");
                }
                System.out.println("BookingsController/ListBookings " + bookingID);

                JSONObject item = new JSONObject();

                try {
                    PreparedStatement ps = Main.db.prepareStatement("SELECT bookingID, bookingType, description, slots FROM Bookings WHERE bookingID = ?");
                    ps.setInt(1, bookingID);
                    ResultSet results = ps.executeQuery();
                    while (results.next()){

                        item.put("bookingsID", results.getInt(1));
                        item.put("bookingTyoe", results.getInt(2));
                        item.put("description", results.getString(3));
                        item.put("slots", results.getInt(4));

                    }
                    return item.toString();
                }catch (Exception e){
                    System.out.println("Database Error " + e.getMessage());
                    return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
                }
        }
        public static void DeleteBookings(int bookingID){
            try {
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Bookings WHERE bookingID = ?");
                ps.setInt(1, bookingID);
                ps.executeUpdate();
            }catch (Exception e){
                System.out.println("Error" + e.getMessage());
            }
        }
        public static void UpdateBookings(int bookingID, int bookingType, String description, int slots){
            try{
                PreparedStatement ps = Main.db.prepareStatement("UPDATE Bookings SET bookingType = ?, description = ?, slots = ? WHERE bookingID = ?");
                ps.setInt(1, bookingType);
                ps.setString(2, description);
                ps.setInt(3,slots);
                ps.setInt(4, bookingID);
                ps.executeUpdate();
            } catch (Exception e){
                System.out.println("Error" + e.getMessage());
            }
        }
}
