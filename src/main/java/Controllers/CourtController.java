package Controllers;

import Server.Main;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("CourtController/")
public class CourtController {
        public static void ListBookedCourts(int bookingID){
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT courtNo FROM Courts WHERE bookingID = ?");
                ps.setInt(1, bookingID);
                ResultSet results = ps.executeQuery();
                while(results.next()){
                    int courtNo = results.getInt(1);
                    System.out.println(courtNo);
                }
            }catch (Exception e){
                System.out.println("Error " + e.getMessage());
            }
        }
        public static boolean CheckConflictingBookings(int bookingID1, int bookingID2){
            try {
                PreparedStatement ps1 = Main.db.prepareStatement("SELECT courtNo FROM Courts WHERE bookingID = ?");
                ps1.setInt(1, bookingID1);
                ResultSet results1 = ps1.executeQuery();

                PreparedStatement ps2 = Main.db.prepareStatement("SELECT courtNo FROM Courts WHERE bookingID = ?");
                ps2.setInt(1, bookingID2);
                ResultSet results2 = ps2.executeQuery();

                while(results1.next()){
                    while(results2.next()){
                        if (results1.getInt(1) == results2.getInt(1)){
                            System.out.println("Court booking conflict found");
                            return true;
                        }
                    }
                }
                System.out.println("Court booking conflict not found");
            }catch (Exception e){
                System.out.println("Error " + e.getMessage());
            }
            return false;
        }
        @GET
        @Path("ListAllCourtBookings")
        @Produces(MediaType.APPLICATION_JSON)
        public static String ListAllCourtBookings(){
            System.out.println("ListAllCourtBookings");
            JSONArray list = new JSONArray();
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT bookingID, courtNo FROM Courts");
                ResultSet results = ps.executeQuery();
                while (results.next()) {
                    JSONObject item = new JSONObject();
                    item.put("bookingID", results.getInt(1));
                    item.put("courtNo", results.getInt(2));
                    list.add(item);
                }
                return list.toString();
            }catch (Exception e){
                System.out.println("Error " + e.getMessage());
                return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
            }
        }
        public static void InsertCourtBookings(int bookingID, int courtNo){
            try {
                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Courts (bookingID, courtNo) VALUES (?, ?)");
                ps.setInt(1, bookingID);
                ps.setInt(2, courtNo);
                ps.executeUpdate();
                System.out.println("Records successfully added");
            }catch (Exception e){
                System.out.println("Error " + e.getMessage());
            }
        }
        public static void DeleteCourtBookings(int bookingID){
            try {
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Courts WHERE bookingID = ?");
                ps.setInt(1, bookingID);
                ps.executeUpdate();
                System.out.println("Records removed successfully");
            }catch (Exception e){
                System.out.println("Error " + e.getMessage());
            }
        }
}
