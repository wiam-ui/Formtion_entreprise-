package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "formations") // Indique le nom de la table dans la base de données
public class Formation {

    @Id // Définit ce champ comme la clé primaire
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrément (1, 2, 3...)
    private Long id;

    @Column(nullable = false, length = 150) // Le titre ne peut pas être vide
    private String titre;

    @Column(columnDefinition = "TEXT") // Permet de stocker de longs textes
    private String description;

    @Column(nullable = false)
    private Integer duree; // Durée en heures

    @Column(name = "competences_visees")
    private String competencesVisees;

    // --- CONSTRUCTEURS ---

    // Constructeur vide obligatoire pour JPA
    public Formation() {
    }

    public Formation(String titre, String description, Integer duree, String competencesVisees) {
        this.titre = titre;
        this.description = description;
        this.duree = duree;
        this.competencesVisees = competencesVisees;
    }

    // --- GETTERS ET SETTERS ---
    // (Indispensables pour que Spring Boot puisse lire et modifier les données)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDuree() {
        return duree;
    }

    public void setDuree(Integer duree) {
        this.duree = duree;
    }

    public String getCompetencesVisees() {
        return competencesVisees;
    }

    public void setCompetencesVisees(String competencesVisees) {
        this.competencesVisees = competencesVisees;
    }
}