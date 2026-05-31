package com.example.demo.service;

import com.example.demo.dto.SessionRequest;
import com.example.demo.model.Session;

import java.util.List;

public interface SessionService {

    List<Session> getAllSessions();

    Session getSessionById(Long id);

    Session createSession(SessionRequest request);

    Session updateSession(Long id, Session sessionDetails);

    void deleteSession(Long id);
}