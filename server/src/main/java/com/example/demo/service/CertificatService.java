package com.example.demo.service;

import com.example.demo.model.Inscription;
import java.io.ByteArrayInputStream;

public interface CertificatService {
    ByteArrayInputStream genererCertificatPdf(Inscription inscription);
}