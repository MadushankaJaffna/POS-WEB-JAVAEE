package io.gitub.madushanka.pos.service;

import io.gitub.madushanka.pos.database.DbConnection;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
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

@WebServlet(urlPatterns = "/api/v1/custom")
public class Customservelet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Connection connection = DbConnection.getInstance().getConnection();
        try {
            PreparedStatement prst = connection.prepareStatement("SELECT * FROM Customer");
            ResultSet resultSet = prst.executeQuery();
            JsonArrayBuilder array = Json.createArrayBuilder();
            while (resultSet.next()) {
                JsonObjectBuilder obj = Json.createObjectBuilder();
                obj.add("id", resultSet.getString(1));
                obj.add("name", resultSet.getString(2));
                obj.add("address", resultSet.getString(3));
                array.add(obj.build());
            }
            resp.setContentType("application/json");
            JsonArray build = array.build();
            resp.getWriter().println(build);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Connection connection = DbConnection.getInstance().getConnection();
        try {
            PreparedStatement prst = connection.prepareStatement("SELECT * FROM Item");
            ResultSet resultSet = prst.executeQuery();
            JsonArrayBuilder array = Json.createArrayBuilder();
            while (resultSet.next()) {
                JsonObjectBuilder obj = Json.createObjectBuilder();
                obj.add("code", resultSet.getString(1));
                obj.add("description", resultSet.getString(2));
                obj.add("qtyOnHand",resultSet.getString(3) );
                obj.add("unitPrice",resultSet.getString(4));
                array.add(obj.build());
            }
            resp.setContentType("application/json");
            resp.getWriter().println(array.build());

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
