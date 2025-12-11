package com.Sentinel.Reimbursement_Service.Service;

import com.Sentinel.Reimbursement_Service.DTO.OCRdata;
import com.Sentinel.Reimbursement_Service.DTO.ReimbursementRequestDTO;
import com.Sentinel.Reimbursement_Service.Entity.ReimbursementRequest;
import com.Sentinel.Reimbursement_Service.DTO.Status;
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
}
