package com.Sentinel.Reimbursement_Service.Controller;

import com.Sentinel.Reimbursement_Service.DTO.ReimbursementRequestDTO;
import com.Sentinel.Reimbursement_Service.Service.ReimbursementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
@RequestMapping("/reimbursement")
public class ReimbursementRequestController {

    private final ReimbursementService reimbursementService;

    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReimbursement(@RequestPart("data") ReimbursementRequestDTO data, @RequestPart("file")MultipartFile file) {
        try {
            return new ResponseEntity<>(reimbursementService.createRequest(data, file), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getAllRequests() {
        return new ResponseEntity<>(reimbursementService.getAllRequests(), HttpStatus.OK);
    }
}
