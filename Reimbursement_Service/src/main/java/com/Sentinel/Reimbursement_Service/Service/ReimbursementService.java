package com.Sentinel.Reimbursement_Service.Service;

import com.Sentinel.Reimbursement_Service.DTO.FraudLevel;
import com.Sentinel.Reimbursement_Service.DTO.OCRdata;
import com.Sentinel.Reimbursement_Service.DTO.ReimbursementRequestDTO;
import com.Sentinel.Reimbursement_Service.Entity.ReimbursementRequest;
import com.Sentinel.Reimbursement_Service.DTO.Status;
import com.Sentinel.Reimbursement_Service.Entity.RequestHistory;
import com.Sentinel.Reimbursement_Service.FraudDetectionEngine.FraudDetectionService;
import com.Sentinel.Reimbursement_Service.FraudDetectionEngine.PerceptualHashService;
import com.Sentinel.Reimbursement_Service.FraudDetectionEngine.TextHashService;
import com.Sentinel.Reimbursement_Service.Repository.ReimbursementHistoryRepo;
import com.Sentinel.Reimbursement_Service.Repository.ReimbursementRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReimbursementService {

    private final ReimbursementRepo repo;
    private final StorageService storageService;
    private final OCRService ocrService;
    private final AIService aiService;
    private final FraudDetectionService fraudDetectionService;
    private final PerceptualHashService perceptualHashService;
    private final TextHashService textHashService;
    private final ReimbursementHistoryRepo historyRepo;

    @Transactional
    public ReimbursementRequest saveInitialRequest(ReimbursementRequestDTO data, String receiptUrl) {
        ReimbursementRequest request = new ReimbursementRequest();
        request.setEmployeeId(data.getEmployeeId());
        request.setAmount(data.getAmount());
        request.setExpenseDate(LocalDate.parse(data.getExpenseDate()));
        request.setVendorName(data.getVendorName());
        request.setCategory(data.getCategory());
        request.setDescription(data.getDescription());
        request.setPaymentMode(data.getPaymentMethod());
        request.setReceiptURL(receiptUrl);
        request.setStatus(Status.PENDING);
        return repo.save(request);
    }

    @Transactional(rollbackFor = Exception.class)
    public String createRequest(ReimbursementRequestDTO data, MultipartFile file) throws Exception {
        String url = null;
        try {
            log.info("initial Request received");
            url = storageService.upload(file);
            log.info("file upload to cloudinary finished");
            ReimbursementRequest request = saveInitialRequest(data, url);
            log.info("initial request saved");
            String options = "{\"languages\": [\"eng\"]}";
            String ocrResult = ocrService.extractText(file, options);
            log.info("ocr result received");
            System.out.print(ocrResult);
            OCRdata extractedData = aiService.extractOCRData(ocrResult);
            log.info(extractedData.toString());
            int fraudPoints = fraudDetectionService.runEngine(request, extractedData, ocrResult, file);
            FraudLevel level = resolveFraudLevel(fraudPoints);
            request.setFraudScore(fraudPoints);
            request.setFraudLevel(level);
            request.setStatus(Status.COMPLETED);
            repo.save(request);
            if(level.equals(FraudLevel.LOW) || level.equals(FraudLevel.MEDIUM)) {
                saveToHistory(request, extractedData, ocrResult, file);
            }
        } catch (Exception e) {
            if(url != null) {
                try {
                    storageService.delete(url);
                    log.warn("Cloudinary image deleted due to failure");
                } catch (Exception ex) {
                    log.warn("Failed to delete uploaded cloudinary image", ex);
                }
            }
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        return "request raised successfully";
    }

    private void saveToHistory(ReimbursementRequest request, OCRdata extracted, String ocrResult, MultipartFile file) {
        RequestHistory history = new RequestHistory();
        history.setReimbursementRequestId(request.getId());
        history.setAmount(request.getAmount());
        history.setExpenseDate(request.getExpenseDate());
        history.setVendorName(request.getVendorName());
        history.setInvoiceNumber(extracted.getBillNumber());
        history.setImagePhash(perceptualHashService.generatePhash(file));
        history.setTextHash(textHashService.generateHash(ocrResult));
        historyRepo.save(history);
    }

    private FraudLevel resolveFraudLevel(int fraudPoints) {
        if(fraudPoints < 30) return FraudLevel.LOW;
        if(fraudPoints >= 30 && fraudPoints < 60) return FraudLevel.MEDIUM;
        if(fraudPoints >= 60 && fraudPoints < 85) return FraudLevel.HIGH;
        return FraudLevel.CONFIRMED;
    }
}
