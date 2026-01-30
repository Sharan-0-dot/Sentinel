package com.Sentinel.Reimbursement_Service.Service;

import com.Sentinel.Reimbursement_Service.DTO.*;
import com.Sentinel.Reimbursement_Service.Entity.ReimbursementRequest;
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
import java.util.ArrayList;
import java.util.List;

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
            request.setOcrData(ocrResult);
            log.info("ocr result received");
            System.out.print(ocrResult);
            OCRdata extractedData = aiService.extractOCRData(ocrResult);
            log.info(extractedData.toString());
            ResponseDTO response = fraudDetectionService.runEngine(request, extractedData, ocrResult, file);
            FraudLevel level = resolveFraudLevel(response.getFraudScore());
            request.setFraudScore(response.getFraudScore());
            request.setFraudLevel(level);
            request.setStatus(Status.COMPLETED);
            request.setFraudDescription(response.getFinalDescription());
            repo.save(request);
            if(level.equals(FraudLevel.LOW) || level.equals(FraudLevel.MEDIUM)) {
                saveToHistory(request, extractedData, ocrResult, file);
            }
            return "fraudLevel : " + request.getFraudLevel() + " " + request.getFraudDescription();
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
    }

    private void saveToHistory(ReimbursementRequest request, OCRdata extracted, String ocrResult, MultipartFile file) {
        RequestHistory history = new RequestHistory();
        history.setReimbursementRequestId(request.getId());
        history.setEmployeeId(request.getEmployeeId());
        history.setAmount(request.getAmount());
        history.setExpenseDate(request.getExpenseDate());
        history.setVendorName(request.getVendorName());
        history.setInvoiceNumber(extracted.getBillNumber());
        history.setImagePhash(perceptualHashService.generatePhash(file));
        history.setTextHash(textHashService.generateHash(ocrResult));
        historyRepo.save(history);
    }

    private FraudLevel resolveFraudLevel(int fraudPoints) {
        if(fraudPoints < 25) return FraudLevel.LOW;
        if(fraudPoints < 50) return FraudLevel.MEDIUM;
        if(fraudPoints < 90) return FraudLevel.HIGH;
        return FraudLevel.CONFIRMED;
    }

    public List<AdminReimbursementDTO> getAllRequests() {
        List<ReimbursementRequest> list = repo.findAll();
        List<AdminReimbursementDTO> result = new ArrayList<>();
        for(ReimbursementRequest stored : list) {
            AdminReimbursementDTO cur = new AdminReimbursementDTO();
            cur.setId(stored.getId());
            cur.setAmount(stored.getAmount());
            cur.setCategory(stored.getCategory());
            cur.setStatus(stored.getStatus());
            cur.setEmployeeId(stored.getEmployeeId());
            cur.setExpenseDate(stored.getExpenseDate());
            cur.setVendorName(stored.getVendorName());
            cur.setFraudLevel(stored.getFraudLevel());
            cur.setFraudScore(stored.getFraudScore());
            cur.setCreatedAt(stored.getCreatedAt());
            cur.setDescription(stored.getFraudDescription());
            result.add(cur);
        }
        return result;
    }

    public List<AdminReimbursementDTO> getRequestsOfUser(String id) {
        List<ReimbursementRequest> list = repo.findByEmployeeId(id);
        List<AdminReimbursementDTO> result = new ArrayList<>();
        for(ReimbursementRequest stored : list) {
            AdminReimbursementDTO cur = new AdminReimbursementDTO();
            cur.setId(stored.getId());
            cur.setAmount(stored.getAmount());
            cur.setCategory(stored.getCategory());
            cur.setStatus(stored.getStatus());
            cur.setEmployeeId(stored.getEmployeeId());
            cur.setExpenseDate(stored.getExpenseDate());
            cur.setVendorName(stored.getVendorName());
            cur.setFraudLevel(stored.getFraudLevel());
            cur.setFraudScore(stored.getFraudScore());
            cur.setCreatedAt(stored.getCreatedAt());
            cur.setDescription(stored.getFraudDescription());
            result.add(cur);
        }
        return result;
    }
}
