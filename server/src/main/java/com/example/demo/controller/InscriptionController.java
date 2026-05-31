package com.example.demo.controller;

import com.example.demo.dto.CreateInscriptionRequest;
import com.example.demo.model.Inscription;
import com.example.demo.service.InscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    @Autowired
    private InscriptionService inscriptionService;

    // Créer une inscription (POST http://localhost:8080/api/inscriptions)
    @PostMapping
    public ResponseEntity<Inscription> inscrire(@RequestBody CreateInscriptionRequest request) {
        return new ResponseEntity<>(inscriptionService.inscrireEmploye(request), HttpStatus.CREATED);
    }

    // Récupérer toutes les inscriptions (RH) (GET
    // http://localhost:8080/api/inscriptions)
    @GetMapping
    public ResponseEntity<List<Inscription>> getAll() {
        return ResponseEntity.ok(inscriptionService.getAllInscriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscription> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inscriptionService.getInscriptionById(id));
    }

    // Récupérer les inscriptions d'un employé spécifique (GET
    // http://localhost:8080/api/inscriptions/employee/{employeeId})
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Inscription>> getMesFormations(@PathVariable Long employeeId) {
        return ResponseEntity.ok(inscriptionService.getInscriptionsParEmploye(employeeId));
    }

    // Modifier le suivi/progression (PUT
    // http://localhost:8080/api/inscriptions/{id}/progression?statut=TERMINE)
    @PutMapping("/{id}/progression")
    public ResponseEntity<Inscription> modifierProgression(
            @PathVariable Long id,
            @RequestParam String statut) {
        return ResponseEntity.ok(inscriptionService.updateProgression(id, statut));
    }

    // Supprimer/Annuler une inscription (DELETE
    // http://localhost:8080/api/inscriptions/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> annuler(@PathVariable Long id) {
        inscriptionService.annulerInscription(id);
        return ResponseEntity.noContent().build();
    }
}