package io.gitub.madushanka.pos.filter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class DoFilter extends HttpFilter {

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        response.setHeader("Access-Control-Allow-Origin","*");
        response.setHeader("Access-Control-Allow-Method","GET,POST,PUT,DELETE,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers","Content-Count,X-Cype");
        response.setHeader("Access-Control-Expose-Headers","X-Cype");
    }
}
