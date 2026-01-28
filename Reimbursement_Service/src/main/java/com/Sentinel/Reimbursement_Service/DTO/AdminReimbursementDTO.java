package com.Sentinel.Reimbursement_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminReimbursementDTO {
    private String id;
    private String employeeId;
    private Double amount;
    private String vendorName;
    private String category;
    private LocalDate expenseDate;

    private int fraudScore;
    private FraudLevel fraudLevel;
    private Status status;
    private String description;
    private LocalDateTime createdAt;
}
