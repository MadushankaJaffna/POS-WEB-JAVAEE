package io.gitub.madushanka.pos.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DbConnection {
    private static Connection connection;
    private static DbConnection dbconnection;

    private DbConnection() {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/DEP4Hibernate","root","123");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static DbConnection getInstance(){
        return (dbconnection==null)?(dbconnection=new DbConnection()):dbconnection;
    }

    public Connection getConnection(){
        return connection;
    }

}
