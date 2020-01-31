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
import java.util.Date;

@WebServlet("/api/v1/order")
public class OrderServelet extends HttpServlet {

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
            int page = req.getParameter("page") == null ? 0 : Integer.parseInt(req.getParameter("page"));
            int size = req.getParameter("size") == null ? 5 : Integer.parseInt(req.getParameter("size"));
            PreparedStatement ps = getConnection().prepareStatement("SELECT * FROM `order` LIMIT ? OFFSET ?");
            ps.setObject(1,size);
            ps.setObject(2,page * size);
            ResultSet rst = ps.executeQuery();
            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
            while (rst.next()){
                String code = rst.getString(1);
                String description = rst.getString(2);
                String qtyOnHand = rst.getString(3);
                String unitPrice = rst.getString(4);
                JsonObjectBuilder ob = Json.createObjectBuilder();
                ob.add("code",code);
                ob.add("description",description);
                ob.add("qtyOnHand",qtyOnHand);
                ob.add("unitPrice",unitPrice);
                arrayBuilder.add(ob.build());
            }
            ResultSet resultSet = getConnection().createStatement().executeQuery("SELECT COUNT(*) FROM `Order`");
            resultSet.next();
            resp.setIntHeader("X-Count",resultSet.getInt(1));
            resp.setContentType("application/json");
            resp.getWriter().println(arrayBuilder.build().toString());

            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();

        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            PreparedStatement ps1 = getConnection().prepareStatement("SELECT id FROM `order` Order By id DESC LIMIT 1");
            ResultSet oid = ps1.executeQuery();

            if (oid.next()){
                System.out.println("Order Id : "+oid.getString(1));

                String cusId = req.getParameter("cusId");
                int orderID = Integer.valueOf(oid.getString(1))+1;
                PreparedStatement ps = getConnection().prepareStatement("INSERT INTO `order` VALUES(?,?,?)");
                ps.setObject(1,orderID);
                ps.setObject(2,new java.sql.Date(new Date().getTime()));
                ps.setObject(3,cusId);

                int i = ps.executeUpdate();
                System.out.println("Order Placed : "+i);

                JsonArray jsonValues = Json.createReader(req.getReader()).readArray();
                System.out.println("Order Details size : "+jsonValues.size());
                if (i>0){
                    for (int j=0;j< jsonValues.size();j++){
                        JsonObject jsonObject = jsonValues.getJsonObject(j);

                        PreparedStatement ps2 = getConnection().prepareStatement("INSERT INTO OrderDetail VALUES(?,?,?,?)");
                        ps2.setObject(1,jsonObject.getString("code"));
                        ps2.setObject(2,orderID);
                        ps2.setObject(3,jsonObject.getString("qtyOnHand"));
                        ps2.setObject(4,jsonObject.getString("unitPrice"));
                        ps2.executeUpdate();
                    }
                }
            }

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

            PreparedStatement prstm = getConnection().prepareStatement("UPDATE `order` SET date=? ,customerID=? WHERE id=? ");

            prstm.setObject(3, jsonObject.getString("id"));
            prstm.setObject(1, jsonObject.getString("date"));
            prstm.setObject(2, jsonObject.getString("customerId"));
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

            PreparedStatement prstm = getConnection().prepareStatement("DELETE FROM `order` WHERE id=?");
            prstm.setObject(1, jsonObject.getString("id"));
            prstm.executeUpdate();

            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
