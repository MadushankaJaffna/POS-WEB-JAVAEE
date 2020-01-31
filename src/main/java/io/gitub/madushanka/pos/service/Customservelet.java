package io.gitub.madushanka.pos.service;

import org.apache.commons.dbcp2.BasicDataSource;

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

    public Connection getConnection() {
        try {
            return ((BasicDataSource)getServletContext().getAttribute("pool")).getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            PreparedStatement prst = getConnection().prepareStatement("SELECT * FROM Customer");
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

            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            PreparedStatement prst = getConnection().prepareStatement("SELECT * FROM Item");
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

            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
