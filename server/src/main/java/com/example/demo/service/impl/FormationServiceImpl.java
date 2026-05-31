package com.example.demo.service.impl;

import com.example.demo.model.Formation;
import com.example.demo.repository.FormationRepository;
import com.example.demo.service.FormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class FormationServiceImpl implements FormationService {

    @Autowired
    private FormationRepository formationRepository;

    @Override
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    @Override
    public Formation getFormationById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Formation non trouvée avec l'id : " + id));
    }

    @Override
    public Formation createFormation(Formation formation) {
        if (formation.getDuree() <= 0) {
            throw new IllegalArgumentException("La durée de la formation doit être supérieure à 0.");
        }
        return formationRepository.save(formation);
    }

    @Override
    public Formation updateFormation(Long id, Formation formationDetails) {
        Formation formation = getFormationById(id);

        if (formationDetails.getTitre() != null) {
            formation.setTitre(formationDetails.getTitre());
        }
        if (formationDetails.getDescription() != null) {
            formation.setDescription(formationDetails.getDescription());
        }
        if (formationDetails.getDuree() != null) {
            formation.setDuree(formationDetails.getDuree());
        }
        if (formationDetails.getCompetencesVisees() != null) {
            formation.setCompetencesVisees(formationDetails.getCompetencesVisees());
        }

        return formationRepository.save(formation);
    }

    @Override
    public void deleteFormation(Long id) {
        Formation formation = getFormationById(id);
        formationRepository.delete(formation);
    }
}