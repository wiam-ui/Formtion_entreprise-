package com.example.demo.controller;

import com.example.demo.dto.SessionRequest;
import com.example.demo.model.Session;
import com.example.demo.service.SessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @GetMapping
    public ResponseEntity<List<Session>> getAll() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @PostMapping
    public ResponseEntity<Session> create(@RequestBody SessionRequest request) {
        return new ResponseEntity<>(
                sessionService.createSession(request),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Session> update(
            @PathVariable Long id,
            @RequestBody Session sessionDetails
    ) {
        return ResponseEntity.ok(
                sessionService.updateSession(id, sessionDetails)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}