package com.example.demo.controller;

import com.example.demo.model.Inscription;
import com.example.demo.service.InscriptionService;
import com.example.demo.service.CertificatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/certificats")
public class CertificatController {

    @Autowired
    private InscriptionService inscriptionService;

    @Autowired
    private CertificatService certificatService;

    // Télécharger le PDF (GET http://localhost:8080/api/certificats/inscription/{inscriptionId})
    @GetMapping("/inscription/{inscriptionId}")
    public ResponseEntity<?> telechargerCertificat(@PathVariable Long inscriptionId) {

        // 1. Récupérer l'inscription demandée
        Inscription inscription = inscriptionService.getInscriptionById(inscriptionId);

        // 2. RÈGLE MÉTIER : On vérifie si la formation est bien complétée
        if (!"TERMINE".equalsIgnoreCase(inscription.getStatutProgression())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : Impossible de générer un certificat. Le statut actuel est : " + inscription.getStatutProgression());
        }

        // 3. Génération du flux binaire du PDF
        ByteArrayInputStream pdfFlux = certificatService.genererCertificatPdf(inscription);

        // 4. Configuration des entêtes HTTP pour forcer le téléchargement du fichier
        HttpHeaders headers = new HttpHeaders();
        String nomFichier = "Certificat_" + inscription.getEmployee().getNom().replace(" ", "_") + ".pdf";
        headers.add("Content-Disposition", "attachment; filename=" + nomFichier);

        // 5. Envoi de la réponse sous forme de fichier téléchargeable
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfFlux));
    }
}