package io.gitub.madushanka.pos.service;

import org.apache.commons.dbcp2.BasicDataSource;

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
            PreparedStatement prst = getConnection().prepareStatement("SELECT * FROM Customer LIMIT ? OFFSET ?");
            int page =  (req.getParameter("page")==null)?0: Integer.parseInt(req.getParameter("page"))-1;
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
                array.add(obj.build());
            }
            PreparedStatement prst2 = getConnection().prepareStatement("SELECT COUNT(*) FROM Customer");
            ResultSet resultSet1 = prst2.executeQuery();
            resultSet1.next();
            resp.setIntHeader("X-Count",resultSet1.getInt(1));
            resp.setContentType("application/json");
            JsonArray build = array.build();
            resp.getWriter().println(build.toString());
            getConnection().close();
        } catch (SQLException e) {
            try {
                getConnection().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            JsonReader reader = Json.createReader(req.getReader());
            JsonObject jsonObject = reader.readObject();

            PreparedStatement prstm = getConnection().prepareStatement("INSERT INTO Customer VALUES(?,?,?)");
            prstm.setObject(1, jsonObject.getString("id"));
            prstm.setObject(2, jsonObject.getString("name"));
            prstm.setObject(3, jsonObject.getString("address"));
            prstm.executeUpdate();
            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            JsonReader reader = Json.createReader(req.getReader());
            JsonObject jsonObject = reader.readObject();

            PreparedStatement prstm = getConnection().prepareStatement("UPDATE Customer SET name=?,address=? WHERE customerId=? ");
            prstm.setObject(3, jsonObject.getString("id"));
            prstm.setObject(2, jsonObject.getString("name"));
            prstm.setObject(1, jsonObject.getString("address"));
            prstm.executeUpdate();
            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            JsonReader reader = Json.createReader(req.getReader());
            JsonObject jsonObject = reader.readObject();

            PreparedStatement prstm = getConnection().prepareStatement("DELETE FROM Customer WHERE customerId=? ");
            prstm.setObject(1, jsonObject.getString("id"));
            prstm.executeUpdate();
            getConnection().close();
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }
}
