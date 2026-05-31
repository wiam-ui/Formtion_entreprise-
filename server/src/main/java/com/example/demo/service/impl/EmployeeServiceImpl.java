package com.example.demo.service.impl;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Employee> getAllEmployees() { return employeeRepository.findAll(); }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Employé introuvable"));
    }

    @Override
    public Employee createEmployee(Employee employee) {
        // Generate temporary password if not provided
        if (employee.getMotDePasse() == null || employee.getMotDePasse().isEmpty()) {
            employee.setMotDePasse(generateTemporaryPassword());
        }
        
        // Encode password before saving
        employee.setMotDePasse(passwordEncoder.encode(employee.getMotDePasse()));

        // Save employee
        Employee savedEmployee = employeeRepository.save(employee);

        // Synchronize with User table for authentication
        if (userRepository.findByEmail(employee.getEmail()).isEmpty()) {
            User user = User.builder()
                    .fullname(employee.getNom())
                    .email(employee.getEmail())
                    .password(employee.getMotDePasse())
                    .role(employee.getRole())
                    .build();
            userRepository.save(user);
        }

        return savedEmployee;
    }

    @Override
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);
        
        if (employeeDetails.getNom() != null) employee.setNom(employeeDetails.getNom());
        if (employeeDetails.getEmail() != null) {
            // Update User table email as well
            userRepository.findByEmail(employee.getEmail()).ifPresent(user -> {
                user.setEmail(employeeDetails.getEmail());
                userRepository.save(user);
            });
            employee.setEmail(employeeDetails.getEmail());
        }
        if (employeeDetails.getRole() != null) {
            userRepository.findByEmail(employee.getEmail()).ifPresent(user -> {
                user.setRole(employeeDetails.getRole());
                userRepository.save(user);
            });
            employee.setRole(employeeDetails.getRole());
        }
        
        return employeeRepository.save(employee);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        
        // Remove from User table as well
        userRepository.findByEmail(employee.getEmail())
            .ifPresent(user -> userRepository.delete(user));
            
        employeeRepository.deleteById(id);
    }

    /**
     * Generate a temporary password for new employees
     * Format: TempPassword_<timestamp>
     */
    private String generateTemporaryPassword() {
        return "TempPassword_" + System.currentTimeMillis();
    }
}