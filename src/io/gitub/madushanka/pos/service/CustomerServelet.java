package io.gitub.madushanka.pos.service;

import io.gitub.madushanka.pos.database.DbConnection;

import javax.json.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(urlPatterns = "/api/v1/customers")
public class CustomerServelet extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Connection connection = DbConnection.getInstance().getConnection();
        try {
            PreparedStatement prst = connection.prepareStatement("SELECT * FROM Customer LIMIT ? OFFSET ?");
            int page =  (req.getParameter("page")==null)?0: Integer.parseInt(req.getParameter("page"));
            int size = req.getParameter("size")==null?5: Integer.parseInt(req.getParameter("size"));
            prst.setObject(1,size);
            prst.setObject(2,page*size);
            ResultSet resultSet = prst.executeQuery();
            JsonArrayBuilder array = Json.createArrayBuilder();
            while (resultSet.next()) {
                JsonObjectBuilder obj = Json.createObjectBuilder();
                obj.add("id", resultSet.getString(1));
                obj.add("name", resultSet.getString(2));
                obj.add("address", resultSet.getString(3));
                array.add(obj);
            }
            PreparedStatement prst2 = connection.prepareStatement("SELECT COUNT(*) FROM Customer");
            ResultSet resultSet1 = prst2.executeQuery();
            resultSet1.next();
            resp.setIntHeader("X-Count",resultSet1.getInt(1));
            resp.setContentType("application.json");
            JsonArray build = array.build();
            resp.getWriter().println(build.toString());
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Connection connection = DbConnection.getInstance().getConnection();
        try {
            JsonReader reader = Json.createReader(req.getReader());
            JsonObject jsonObject = reader.readObject();

            PreparedStatement prstm = connection.prepareStatement("INSERT INTO Customer VALUES(?,?,?)");
            prstm.setObject(1, jsonObject.getString("id"));
            prstm.setObject(2, jsonObject.getString("name"));
            prstm.setObject(3, jsonObject.getString("address"));
            prstm.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Connection connection = DbConnection.getInstance().getConnection();
        try {
            JsonReader reader = Json.createReader(req.getReader());
            JsonObject jsonObject = reader.readObject();

            PreparedStatement prstm = connection.prepareStatement("UPDATE Customer SET name=?,address=? WHERE customerId=? ");
            prstm.setObject(3, jsonObject.getString("id"));
            prstm.setObject(1, jsonObject.getString("name"));
            prstm.setObject(2, jsonObject.getString("address"));
            prstm.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Connection connection = DbConnection.getInstance().getConnection();
        try {
            JsonReader reader = Json.createReader(req.getReader());
            JsonObject jsonObject = reader.readObject();

            PreparedStatement prstm = connection.prepareStatement("DELETE FROM Customer WHERE customerId=? ");
            prstm.setObject(1, jsonObject.getString("id"));
            prstm.executeUpdate();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
