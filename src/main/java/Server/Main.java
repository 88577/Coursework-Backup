package Server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;
import org.sqlite.SQLiteConfig;
import java.sql.Connection;
import java.sql.DriverManager;

public class Main {

    public static Connection db = null;
    // Behaves like a global variable
    public static void main(String[] args){
        // Scanner input = new Scanner(System.in);
        // openDatabase("courseworkDatabase.db");
        // Opening connection to Database
        //closeDatabase();
        //test
        openDatabase("courseworkDatabase.db");

        ResourceConfig config = new ResourceConfig();
        config.packages("Controllers");
        config.register(MultiPartFeature.class);
        ServletHolder servlet = new ServletHolder(new ServletContainer(config));

        Server server = new Server(8081);
        ServletContextHandler context = new ServletContextHandler(server, "/");
        context.addServlet(servlet, "/*");

        try {
            server.start();
            System.out.println("Server successfully started.");
            //Starts Server
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    private static  void openDatabase(String dbFile){
        try{
            Class.forName("org.sqlite.JDBC");
            // Loads the database driver
            SQLiteConfig config = new SQLiteConfig();
            // Does the database settings
            config.enforceForeignKeys(true);
            db = DriverManager.getConnection("jdbc:sqlite:resources/" + dbFile, config.toProperties());
            // Opens database file
            System.out.println("Database connection successfully established.");
        }   catch (Exception exception){
            System.out.println("Database connection error: " + exception.getMessage());
            // Catches any errors and returns error statement
        }
    }

    private static void closeDatabase(){
        try{
            db.close();
            // Closes database
            System.out.println("Disconnected from database successfully.");
        }   catch (Exception exception){
            System.out.println("Database disconnection error:" + exception.getMessage());
        }
    }
}
