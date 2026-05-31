package com.example.demo.repository;

import com.example.demo.model.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByEmployeeId(Long employeeId); // Pour afficher le tableau de bord d'un employé précis
}