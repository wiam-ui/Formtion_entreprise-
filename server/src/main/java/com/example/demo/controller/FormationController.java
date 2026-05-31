package com.example.demo.controller;

import com.example.demo.model.Formation;
import com.example.demo.service.FormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class FormationController {

    @Autowired
    private FormationService formationService;

    // LIRE TOUTES LES FORMATIONS (GET http://localhost:8080/api/formations)
    @GetMapping
    public ResponseEntity<List<Formation>> getAllFormations() {
        return ResponseEntity.ok(formationService.getAllFormations());
    }

    // LIRE UNE FORMATION PAR ID (GET http://localhost:8080/api/formations/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.getFormationById(id));
    }

    // CRÉER UNE FORMATION (POST http://localhost:8080/api/formations)
    @PostMapping
    public ResponseEntity<Formation> createFormation(@RequestBody Formation formation) {
        Formation nouvelleFormation = formationService.createFormation(formation);
        return new ResponseEntity<>(nouvelleFormation, HttpStatus.CREATED);
    }

    // MODIFIER UNE FORMATION (PUT http://localhost:8080/api/formations/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Formation> updateFormation(@PathVariable Long id, @RequestBody Formation formationDetails) {
        Formation formationModifiee = formationService.updateFormation(id, formationDetails);
        return ResponseEntity.ok(formationModifiee);
    }

    // SUPPRIMER UNE FORMATION (DELETE http://localhost:8080/api/formations/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        formationService.deleteFormation(id);
        return ResponseEntity.noContent().build();
    }
}