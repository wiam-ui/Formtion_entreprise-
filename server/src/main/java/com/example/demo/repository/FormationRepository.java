package com.example.demo.repository;

import com.example.demo.model.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    // JpaRepository fournit déjà les méthodes findAll(), findById(), save(), deleteById()
}