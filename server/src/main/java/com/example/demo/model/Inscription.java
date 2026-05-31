package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "inscriptions")
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Session session;

    @Column(nullable = false)
    private String statutProgression; // "INSCRIT", "EN_COURS", "TERMINE"

    private Boolean certificatGenere = false;

    public Inscription() {}

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }
    public String getStatutProgression() { return statutProgression; }
    public void setStatutProgression(String statutProgression) { this.statutProgression = statutProgression; }
    public Boolean getCertificatGenere() { return certificatGenere; }
    public void setCertificatGenere(Boolean certificatGenere) { this.certificatGenere = certificatGenere; }
}