package com.example.demo.service;

import com.example.demo.model.Formation;
import java.util.List;

public interface FormationService {
    List<Formation> getAllFormations();
    Formation getFormationById(Long id);
    Formation createFormation(Formation formation);
    Formation updateFormation(Long id, Formation formationDetails);
    void deleteFormation(Long id);
}