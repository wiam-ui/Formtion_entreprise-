package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();

        // ✅ Routes publiques sans JWT (plus robuste)
        if (path.contains("/api/auth/login") ||
                path.contains("/api/auth/register") ||
                path.contains("/api/auth/refresh-token")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = null;

        // ✅ Lire le token dans l'en-tête Authorization si présent
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        }

        // ✅ Sinon, lire le token depuis le cookie
        if (jwt == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("auth_token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt == null) {
            System.out.println("DEBUG: No auth_token cookie found for path: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // ✅ Extraire email depuis JWT
            final String userEmail = jwtService.extractUsername(jwt);
            System.out.println("DEBUG: Extracted user email: " + userEmail + " for path: " + path);
            System.out.println("JWT = " + jwt);
            // ✅ Authentifier utilisateur
//            if (userEmail != null &&
//                    SecurityContextHolder.getContext().getAuthentication() == null) {
//
//                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
//                System.out.println("USER FOUND = " + userDetails.getUsername());
//                // ✅ Vérifier token
//                if (jwtService.isTokenValid(jwt, userDetails)) {
//
//                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                            userDetails,
//                            null,
//                            userDetails.getAuthorities());
//
//                    authToken.setDetails(
//                            new WebAuthenticationDetailsSource()
//                                    .buildDetails(request));
//
//                    SecurityContextHolder
//                            .getContext()
//                            .setAuthentication(authToken);
//                }
//            }
            if (userEmail != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                System.out.println("Loading user: " + userEmail);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(userEmail);

                System.out.println("USER FOUND = " + userDetails.getUsername());

                boolean valid = jwtService.isTokenValid(jwt, userDetails);

                System.out.println("TOKEN VALID = " + valid);

                if (valid) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));

                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);

                    System.out.println("AUTHENTICATION SET");
                }
            }

        }catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
            e.printStackTrace();
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}