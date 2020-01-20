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

@WebServlet("/api/v1/oderDetail")
public class OrderDetailServelet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Connection connection = DbConnection.getInstance().getConnection();
        try {
            PreparedStatement prst = connection.prepareStatement("SELECT * FROM OrderDetail");
            ResultSet resultSet = prst.executeQuery();
            JsonArrayBuilder array = Json.createArrayBuilder();
            while (resultSet.next()) {
                JsonObjectBuilder obj = Json.createObjectBuilder();
                obj.add("ItemId", resultSet.getString(1));
                obj.add("OrderId", resultSet.getString(2));
                obj.add("Qty", resultSet.getString(3));
                obj.add("UnitPrice", resultSet.getString(4));
                array.add(obj);
            }
            resp.setHeader("Access-controll-allow-origin", "*");
            resp.setContentType("application.json");
            resp.getWriter().println(array.build().toString());

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

            PreparedStatement prstm = connection.prepareStatement("INSERT INTO OrderDetail VALUES(?,?,?,?)");
            prstm.setObject(1, jsonObject.getString("ItemId"));
            prstm.setObject(2, jsonObject.getString("OrderId"));
            prstm.setObject(3, jsonObject.getString("Qty"));
            prstm.setObject(4, jsonObject.getString("UnitPrice"));
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

            PreparedStatement prstm = connection.prepareStatement("UPDATE OrderDetail SET qty=? ,unitPrice=? WHERE Item_id=? AND Order_id=?");

            prstm.setObject(1, jsonObject.getString("Qty"));
            prstm.setObject(2, jsonObject.getString("UnitPrice"));
            prstm.setObject(3, jsonObject.getString("ItemId"));
            prstm.setObject(4, jsonObject.getString("OrderId"));

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

            PreparedStatement prstm = connection.prepareStatement("DELETE FROM OrderDetail WHERE Item_id=? AND Order_id=?");
            prstm.setObject(1, jsonObject.getString("ItemId"));
            prstm.setObject(2, jsonObject.getString("OrderId"));
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
}
