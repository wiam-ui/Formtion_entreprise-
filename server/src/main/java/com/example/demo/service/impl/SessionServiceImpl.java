package com.example.demo.service.impl;

import com.example.demo.dto.SessionRequest;
import com.example.demo.model.Formation;
import com.example.demo.model.Session;
import com.example.demo.repository.FormationRepository;
import com.example.demo.repository.SessionRepository;
import com.example.demo.service.SessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Override
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @Override
    public Session getSessionById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Session introuvable avec l'id : " + id
                        ));
    }

    @Override
    public Session createSession(SessionRequest request) {

        Formation formation = formationRepository
                .findById(request.getFormationId())
                .orElseThrow(() ->
                        new NoSuchElementException("Formation introuvable"));

        Session session = new Session();

        session.setFormation(formation);
        session.setDateDebut(request.getDateDebut());
        session.setDateFin(request.getDateFin());
        session.setFormateur(request.getFormateur());

        if (request.getStatut() == null || request.getStatut().isEmpty()) {
            session.setStatut("A_VENIR");
        } else {
            session.setStatut(request.getStatut());
        }

        return sessionRepository.save(session);
    }

    @Override
    public Session updateSession(Long id, Session sessionDetails) {

        Session session = getSessionById(id);

        if (sessionDetails.getFormation() != null) {
            session.setFormation(sessionDetails.getFormation());
        }

        if (sessionDetails.getDateDebut() != null) {
            session.setDateDebut(sessionDetails.getDateDebut());
        }

        if (sessionDetails.getDateFin() != null) {
            session.setDateFin(sessionDetails.getDateFin());
        }

        if (sessionDetails.getFormateur() != null) {
            session.setFormateur(sessionDetails.getFormateur());
        }

        if (sessionDetails.getStatut() != null) {
            session.setStatut(sessionDetails.getStatut());
        }

        return sessionRepository.save(session);
    }

    @Override
    public void deleteSession(Long id) {
        Session session = getSessionById(id);
        sessionRepository.delete(session);
    }
}