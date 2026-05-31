package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.model.User;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final EmployeeRepository employeeRepository;

    public UserController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        Long employeeId = employeeRepository.findByEmail(user.getEmail())
                .map(Employee::getId)
                .orElse(null);

        Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("id", user.getId());
        if (employeeId != null) {
            payload.put("employeeId", employeeId);
        }
        payload.put("email", user.getEmail());
        payload.put("fullname", user.getFullname());
        payload.put("role", user.getRole());

        return ResponseEntity.ok(payload);
    }
}
