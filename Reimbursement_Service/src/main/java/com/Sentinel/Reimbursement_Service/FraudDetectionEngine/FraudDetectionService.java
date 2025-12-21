package com.Sentinel.Reimbursement_Service.FraudDetectionEngine;

import com.Sentinel.Reimbursement_Service.DTO.OCRdata;
import com.Sentinel.Reimbursement_Service.Entity.ReimbursementRequest;
import com.Sentinel.Reimbursement_Service.Repository.ReimbursementHistoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    private final PerceptualHashService pHashService;
    private final TextHashService textHashService;
    private final ReimbursementHistoryRepo historyRepo;

    public int runEngine(ReimbursementRequest originalRequest, OCRdata extractedData, String ocrResult, MultipartFile file) {
        int fraudScore = 0;

        fraudScore += validate(originalRequest, extractedData);
        fraudScore += verifyAcrossHistory(originalRequest);
        fraudScore += matchingPhash(file);
        fraudScore += matchingTextHash(ocrResult);

        return fraudScore;
    }

    // max 20
    public int validate(ReimbursementRequest original, OCRdata ocr) {
        int score = 0;

        if (ocr.getAmount() != null) {
            double diff = Math.abs(ocr.getAmount() - original.getAmount())
                    / original.getAmount();

            if (diff > 0.05) score += 7;
            else if (diff > 0.02) score += 6;
        }

        if (ocr.getVendorName() != null &&
                !ocr.getVendorName().equalsIgnoreCase(original.getVendorName())) {
            score += 6;
        }

        if (ocr.getExpenseDate() != null &&
                Math.abs(ocr.getExpenseDate().toEpochDay() -
                        original.getExpenseDate().toEpochDay()) > 1) {
            score += 7;
        }

        return score;
    }

    // max 35
    public int verifyAcrossHistory(ReimbursementRequest originalRequest) {
        boolean sameVendorDate =
                historyRepo.existsByVendorNameAndExpenseDate(originalRequest.getVendorName(), originalRequest.getExpenseDate());

        boolean sameVendorDateAmount =
                historyRepo.existsByVendorNameAndExpenseDateAndAmount(originalRequest.getVendorName(), originalRequest.getExpenseDate(), originalRequest.getAmount());

        if (sameVendorDateAmount) return 35;
        else if (sameVendorDate) return 25;
        return 0;
    }

    // max 25
    public int matchingPhash(MultipartFile file) {
        long newHash = pHashService.generatePhash(file);
        int best = Integer.MAX_VALUE;
        for (Long oldHash : historyRepo.findAllImagePhashes()) {
            int distance = pHashService.hammingDistance(newHash, oldHash);
            best = Math.min(distance, best);
        }
        if(best <= 5) return 25;
        else if(best <= 10) return 15;
        return 0;
    }

    // max 20
    public int matchingTextHash(String ocrResult) {
        int best = Integer.MAX_VALUE;
        long newHash = textHashService.generateHash(ocrResult);

        for (Long oldHash : historyRepo.findAllTextHashes()) {
            int distance = textHashService.hammingDistance(newHash, oldHash);
            best = Math.min(best, distance);
        }
        if(best <= 5) return 20;
        else if (best <= 10) return 10;
        return 0;
    }
}
