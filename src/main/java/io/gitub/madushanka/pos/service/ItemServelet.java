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

@WebServlet("/api/v1/items")
public class ItemServelet extends HttpServlet {

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
            PreparedStatement prst = getConnection().prepareStatement("SELECT * FROM Item LIMIT ? OFFSET ?");
            int page =  (req.getParameter("page")==null)?0: Integer.parseInt(req.getParameter("page"))-1;
            int size = req.getParameter("size")==null?5: Integer.parseInt(req.getParameter("size"));
            prst.setObject(1,size);
            prst.setObject(2,page*size);
            ResultSet resultSet = prst.executeQuery();
            JsonArrayBuilder array = Json.createArrayBuilder();
            while (resultSet.next()) {
                JsonObjectBuilder obj = Json.createObjectBuilder();
                /*String qty = String.valueOf(resultSet.getInt(3));
                String price = String.valueOf(resultSet.getDouble(4));*/
                obj.add("code", resultSet.getString(1));
                obj.add("description", resultSet.getString(2));
                obj.add("qtyOnHand",resultSet.getString(3) );
                obj.add("unitPrice",resultSet.getString(4));
                array.add(obj.build());
            }
            PreparedStatement prst2 = getConnection().prepareStatement("SELECT COUNT(*) FROM Item");
            ResultSet resultSet1 = prst2.executeQuery();
            resultSet1.next();
            resp.setIntHeader("X-Count",resultSet1.getInt(1));
            resp.setHeader("Access-Control-Allow-Origin", "*");
            resp.setContentType("application/json");
            resp.getWriter().println(array.build().toString());

            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
     }


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        try {
            JsonReader reader = Json.createReader(req.getReader());
            JsonObject jsonObject = reader.readObject();

            PreparedStatement prstm = getConnection().prepareStatement("INSERT INTO Item VALUES(?,?,?,?)");
            prstm.setObject(1, jsonObject.getString("code"));
            prstm.setObject(2, jsonObject.getString("description"));
            prstm.setObject(3, jsonObject.getString("qtyOnHand"));
            prstm.setObject(4, jsonObject.getString("unitPrice"));
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

            PreparedStatement prstm = getConnection().prepareStatement("UPDATE Item SET description=? ,qtyOnHand=?, unitPrice=? WHERE code=? ");
            prstm.setObject(4, jsonObject.getString("code"));
            prstm.setObject(1, jsonObject.getString("description"));
            prstm.setObject(2, jsonObject.getString("qtyOnHand"));
            prstm.setObject(3, jsonObject.getString("unitPrice"));
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

            PreparedStatement prstm = getConnection().prepareStatement("DELETE FROM Item  WHERE code=?");
            prstm.setObject(1, jsonObject.getString("id"));
            prstm.executeUpdate();

            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

