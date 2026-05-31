package com.example.demo.service;

import com.example.demo.dto.CreateInscriptionRequest;
import com.example.demo.model.Inscription;
import java.util.List;

public interface InscriptionService {
    Inscription inscrireEmploye(CreateInscriptionRequest request);
    List<Inscription> getAllInscriptions();
    Inscription getInscriptionById(Long id);
    List<Inscription> getInscriptionsParEmploye(Long employeeId);
    Inscription updateProgression(Long id, String statutProgression);
    void annulerInscription(Long id);
}