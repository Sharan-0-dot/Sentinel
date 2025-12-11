package com.Sentinel.Reimbursement_Service.DTO;

import lombok.Data;

@Data
public class ReimbursementRequestDTO {
    private String employeeId;
    private Double amount;
    private String expenseDate;
    private String vendorName;
    private String category;
    private String description;
    private Payment paymentMethod;
}
