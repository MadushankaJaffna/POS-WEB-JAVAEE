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

@WebServlet("/api/v1/search")
public class SearchServelet extends HttpServlet {

    public Connection getConnection() {
        try {
            return ((BasicDataSource)getServletContext().getAttribute("pool")).getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String query = req.getParameter("query");

        try {
            PreparedStatement ps = getConnection().prepareStatement("SELECT OD.Order_id , o.date , C.customerId , C.name , OD.qty*OD.unitPrice AS total FROM Customer C INNER JOIN `order` o on C.customerId = o.customerID INNER JOIN OrderDetail OD on o.id = OD.Order_id INNER JOIN Item I on OD.Item_id = I.code WHERE o.id LIKE ? OR C.customerId LIKE ? OR C.name LIKE ? OR o.date LIKE ?");

            ps.setObject(1, "%" + query + "%");
            ps.setObject(2, "%" + query + "%");
            ps.setObject(3, "%" + query + "%");
            ps.setObject(4, "%" + query + "%");

            ResultSet rst = ps.executeQuery();

            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
            while (rst.next()) {
                JsonObjectBuilder ob = Json.createObjectBuilder();
                ob.add("oid", rst.getString(1));
                ob.add("odate", rst.getString(2));
                ob.add("cid", rst.getString(3));
                ob.add("cname", rst.getString(4));
                ob.add("total", rst.getString(5));
                arrayBuilder.add(ob.build());
            }
            resp.setContentType("application/json");
            resp.getWriter().println(arrayBuilder.build().toString());

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

            PreparedStatement prstm = getConnection().prepareStatement("UPDATE OrderDetail SET qty=? ,unitPrice=? WHERE Item_id=? AND Order_id=?");

            prstm.setObject(1, jsonObject.getString("Qty"));
            prstm.setObject(2, jsonObject.getString("UnitPrice"));
            prstm.setObject(3, jsonObject.getString("ItemId"));
            prstm.setObject(4, jsonObject.getString("OrderId"));

            prstm.executeUpdate();

            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        try {
            JsonReader reader = Json.createReader(req.getReader());
            JsonObject jsonObject = reader.readObject();

            PreparedStatement prstm = getConnection().prepareStatement("DELETE FROM OrderDetail WHERE Item_id=? AND Order_id=?");
            prstm.setObject(1, jsonObject.getString("ItemId"));
            prstm.setObject(2, jsonObject.getString("OrderId"));
            prstm.executeUpdate();

            getConnection().close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
