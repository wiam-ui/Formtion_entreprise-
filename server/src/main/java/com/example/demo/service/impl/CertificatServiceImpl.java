package com.example.demo.service.impl;

import com.example.demo.model.Inscription;
import com.example.demo.service.CertificatService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;  // IMPORT AJOUTÉ (Indispensable pour la signature de la méthode)
import java.io.ByteArrayOutputStream;
import java.awt.Color;                // IMPORT AJOUTÉ (Indispensable pour Color.DARK_GRAY, Color.BLACK, etc.)
import java.time.format.DateTimeFormatter;

@Service
public class CertificatServiceImpl implements CertificatService {

    @Override
    public ByteArrayInputStream genererCertificatPdf(Inscription inscription) {
        // Création du document au format A4 en mode Paysage (idéal pour un certificat)
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Définition des polices et couleurs
            Font fontTitre = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 32, Color.DARK_GRAY);
            Font fontSousTitre = FontFactory.getFont(FontFactory.HELVETICA, 18, Color.GRAY);
            Font fontNom = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26, Color.BLACK);
            Font fontTexte = FontFactory.getFont(FontFactory.HELVETICA, 16, Color.BLACK);
            Paragraph espace = new Paragraph("\n");

            // 1. Titre Principal
            Paragraph titre = new Paragraph("CERTIFICAT DE FORMATION", fontTitre);
            titre.setAlignment(Element.ALIGN_CENTER);
            document.add(titre);
            document.add(espace);

            // 2. Transition
            Paragraph sousTitre = new Paragraph("Le présent certificat est fièrement décerné à :", fontSousTitre);
            sousTitre.setAlignment(Element.ALIGN_CENTER);
            document.add(sousTitre);
            document.add(espace);

            // 3. Identité de l'employé
            Paragraph nomEmploye = new Paragraph(inscription.getEmployee().getNom(), fontNom);
            nomEmploye.setAlignment(Element.ALIGN_CENTER);
            document.add(nomEmploye);
            document.add(espace);

            // 4. Corps du texte descriptif
            String corpsMessage = "Pour avoir suivi avec assiduité et complété avec succès la session de formation :\n\n"
                    + "\"" + inscription.getSession().getFormation().getTitre() + "\"\n\n"
                    + "dispensée par l'intervenant " + inscription.getSession().getFormateur() + ".";

            Paragraph texte = new Paragraph(corpsMessage, fontTexte);
            texte.setAlignment(Element.ALIGN_CENTER);
            document.add(texte);
            document.add(espace);
            document.add(espace);

            // 5. Date de validation automatique (Date de fin de la session)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
            String dateString = "Fait le " + inscription.getSession().getDateFin().format(formatter);
            Paragraph dateSignature = new Paragraph(dateString, fontSousTitre);
            dateSignature.setAlignment(Element.ALIGN_RIGHT);
            document.add(dateSignature);

            document.close();

        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}