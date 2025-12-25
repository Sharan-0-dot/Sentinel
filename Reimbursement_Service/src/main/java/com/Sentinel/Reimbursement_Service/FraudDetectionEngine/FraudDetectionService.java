package com.Sentinel.Reimbursement_Service.FraudDetectionEngine;

import com.Sentinel.Reimbursement_Service.DTO.OCRdata;
import com.Sentinel.Reimbursement_Service.DTO.ResponseDTO;
import com.Sentinel.Reimbursement_Service.Entity.ReimbursementRequest;
import com.Sentinel.Reimbursement_Service.Entity.RequestHistory;
import com.Sentinel.Reimbursement_Service.Repository.ReimbursementHistoryRepo;
import com.Sentinel.Reimbursement_Service.Service.EmployeePolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    private final PerceptualHashService pHashService;
    private final TextHashService textHashService;
    private final ReimbursementHistoryRepo historyRepo;
    private final EmployeePolicyService policyService;

    public ResponseDTO runEngine(ReimbursementRequest originalRequest, OCRdata extractedData, String ocrResult, MultipartFile file) {
        ResponseDTO response = new ResponseDTO();

        validate(originalRequest, extractedData, response);
        verifyAcrossHistory(originalRequest, response);
        matchingPhash(file, response);
        matchingTextHash(ocrResult, response);
        //checkPolicyViolation(originalRequest, response);

        return response;
    }

    // max 20
    public void validate(ReimbursementRequest original, OCRdata ocr, ResponseDTO response) {

        if (ocr.getAmount() != null) {
            double diff = Math.abs(ocr.getAmount() - original.getAmount())
                    / original.getAmount();

            if (diff > 0.05) {
                response.addScore(7);
                response.addReason("Amount mismatch");
            }
            else if (diff > 0.02) {
                response.addScore(6);
                response.addReason("Minor amount mismatch");
            }
        }

        if (ocr.getVendorName() != null && !ocr.getVendorName().equalsIgnoreCase(original.getVendorName())) {
            response.addScore(6);
            response.addReason("Vendor name mismatch");
        }

        if (ocr.getExpenseDate() != null && Math.abs(ocr.getExpenseDate().toEpochDay() - original.getExpenseDate().toEpochDay()) > 1) {
            response.addScore(7);
            response.addReason("Expense date mismatch");
        }
    }

    // max 35
    public void verifyAcrossHistory(ReimbursementRequest originalRequest, ResponseDTO response) {
        boolean sameVendorDate =
                historyRepo.existsByVendorNameAndExpenseDate(originalRequest.getVendorName(), originalRequest.getExpenseDate());

        boolean sameVendorDateAmount =
                historyRepo.existsByVendorNameAndExpenseDateAndAmount(originalRequest.getVendorName(), originalRequest.getExpenseDate(), originalRequest.getAmount());

        if (sameVendorDateAmount) {
            response.addScore(35);
            response.addReason("Duplicate invoice detected");
        }
        else if (sameVendorDate) {
            response.addScore(25);
            response.addReason("Same Vendor & date detected");
        }
    }

    // max 25
    public void matchingPhash(MultipartFile file, ResponseDTO response) {
        long newHash = pHashService.generatePhash(file);
        int best = Integer.MAX_VALUE;
        for (Long oldHash : historyRepo.findAllImagePhashes()) {
            int distance = pHashService.hammingDistance(newHash, oldHash);
            best = Math.min(distance, best);
        }
        if(best <= 5) {
            response.addScore(25);
            response.addReason("Duplicate receipt image");
        }
        else if(best <= 10) {
            response.addScore(15);
            response.addReason("Similar receipt image");
        }
    }

    // max 20
    public void matchingTextHash(String ocrResult, ResponseDTO response) {
        int best = Integer.MAX_VALUE;
        long newHash = textHashService.generateHash(ocrResult);

        for (Long oldHash : historyRepo.findAllTextHashes()) {
            int distance = textHashService.hammingDistance(newHash, oldHash);
            best = Math.min(best, distance);
        }
        if(best <= 5) {
            response.addScore(20);
            response.addReason("Duplicate invoice text");
        }
        else if (best <= 10) {
            response.addScore(10);
            response.addReason("Similar invoice text");
        }
    }

    // max 25
    public void checkPolicyViolation(ReimbursementRequest request, ResponseDTO response) {
        String policyNumber = policyService.getUserPolicy(request.getEmployeeId());
        Double limit = policyService.getPolicyLimit(policyNumber);
        double curSpending = 0;
        for(RequestHistory history : historyRepo.findByEmployeeIdAndExpenseDate(request.getEmployeeId(), request.getExpenseDate())) {
            curSpending += history.getAmount();
        }
        curSpending += request.getAmount();

        if(curSpending > limit) {
            response.addScore(25);
            response.addReason("Policy limit exceeded");
        }
    }
}
