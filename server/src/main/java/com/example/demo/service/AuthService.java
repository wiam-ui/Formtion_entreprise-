package com.example.demo.service;

import com.example.demo.dto.AuthenticationRequest;
import com.example.demo.dto.AuthenticationResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;

@Service
public class AuthService {

    private final UserRepository repository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthService(UserRepository repository, EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService) {
        this.repository = repository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthenticationResponse register(RegisterRequest request, HttpServletResponse response) {
        // Default role for registration is EMPLOYEE
        Role role = Role.EMPLOYEE;

        // Special case: if email contains 'hr@acme.com', assign HR role
        if (request.getEmail().toLowerCase().contains("hr@")) {
            role = Role.HR;
        }

        var user = User.builder()
                .fullname(request.getFullname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        repository.save(user);

        // Also create an Employee record
        var employee = new Employee(
                request.getFullname(),
                request.getEmail(),
                user.getPassword(),
                role);
        employeeRepository.save(employee);

        return generateTokensAndSetCookies(user, response);
    }

    public AuthenticationResponse login(AuthenticationRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        return generateTokensAndSetCookies(user, response);
    }

    public AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (refreshToken == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        final String userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                String accessToken = jwtService.generateToken(userDetails);
                setCookie(response, "auth_token", accessToken, 86400); // 1 day
                return new AuthenticationResponse(accessToken, null);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return null;
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return null;
    }

    public void logout(HttpServletResponse response) {
        setCookie(response, "auth_token", null, 0);
        setCookie(response, "refresh_token", null, 0);
    }

    private AuthenticationResponse generateTokensAndSetCookies(User user, HttpServletResponse response) {
        var accessToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        setCookie(response, "auth_token", accessToken, 86400); // 1 day
        setCookie(response, "refresh_token", refreshToken, 604800); // 7 days

        return new AuthenticationResponse(accessToken, refreshToken);
    }

    private void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
        // Use an empty string if the value is null (for deletion)
        String cookieValue = (value == null) ? "" : value;
        
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from(name, cookieValue)
                .httpOnly(true)
                .secure(false) // HTTP for localhost development
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax") // Good for localhost cross-origin
                .build();
        
        // Use setHeader to ensure we don't have duplicate headers if not intended, 
        // though addHeader is generally better for multiple cookies.
        // For auth_token and refresh_token, we want both.
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
