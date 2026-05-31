package com.example.demo.service.impl;

import com.example.demo.dto.CreateInscriptionRequest;
import com.example.demo.model.Employee;
import com.example.demo.model.Inscription;
import com.example.demo.model.Session;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.InscriptionRepository;
import com.example.demo.repository.SessionRepository;
import com.example.demo.service.InscriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class InscriptionServiceImpl implements InscriptionService {

    private static final Logger log = LoggerFactory.getLogger(InscriptionServiceImpl.class);

    private final InscriptionRepository inscriptionRepository;
    private final EmployeeRepository employeeRepository;
    private final SessionRepository sessionRepository;

    public InscriptionServiceImpl(InscriptionRepository inscriptionRepository,
                                  EmployeeRepository employeeRepository,
                                  SessionRepository sessionRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.employeeRepository = employeeRepository;
        this.sessionRepository = sessionRepository;
    }

    @Override
    public Inscription inscrireEmploye(CreateInscriptionRequest request) {

        Long employeeId = request.getEmployeeId();
        Long sessionId = request.getSessionId();

        if (employeeId == null) {
            throw new IllegalArgumentException("employeeId est obligatoire");
        }

        if (sessionId == null) {
            throw new IllegalArgumentException("sessionId est obligatoire");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new NoSuchElementException("Employee introuvable avec l'id : " + employeeId));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new NoSuchElementException("Session introuvable avec l'id : " + sessionId));

        Inscription inscription = new Inscription();
        inscription.setEmployee(employee);
        inscription.setSession(session);
        inscription.setStatutProgression("INSCRIT");
        inscription.setCertificatGenere(false);

        return inscriptionRepository.save(inscription);
    }

    @Override
    public List<Inscription> getAllInscriptions() {
        return inscriptionRepository.findAll();
    }

    @Override
    public Inscription getInscriptionById(Long id) {
        return inscriptionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Inscription introuvable avec l'id : " + id));
    }

    @Override
    public List<Inscription> getInscriptionsParEmploye(Long employeeId) {
        return inscriptionRepository.findByEmployeeId(employeeId);
    }

    @Override
    public Inscription updateProgression(Long id, String statutProgression) {
        Inscription inscription = getInscriptionById(id);

        inscription.setStatutProgression(statutProgression.toUpperCase());
        if ("TERMINE".equalsIgnoreCase(statutProgression)) {
            inscription.setCertificatGenere(true);
        } else {
            inscription.setCertificatGenere(false);
        }

        return inscriptionRepository.save(inscription);
    }

    @Override
    public void annulerInscription(Long id) {
        Inscription inscription = getInscriptionById(id);
        inscriptionRepository.delete(inscription);
    }

}