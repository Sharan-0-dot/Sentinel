package com.Sentinel.Reimbursement_Service.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class OCRdata {
    private Double amount;
    private LocalDate expenseDate;
    private String vendorName;
    private Payment paymentMode;
    private String address;
    private String billNumber;
    private Double taxAmount;
}
