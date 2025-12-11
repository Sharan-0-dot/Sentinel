package com.Sentinel.Reimbursement_Service.Entity;

import com.Sentinel.Reimbursement_Service.DTO.FraudLevel;
import com.Sentinel.Reimbursement_Service.DTO.Payment;
import com.Sentinel.Reimbursement_Service.DTO.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ReimbursementRequest")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReimbursementRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String employeeId;
    @Column(nullable = false)
    private Double amount;
    @Column(nullable = false)
    private LocalDate expenseDate;
    @Column(nullable = false)
    private String vendorName;
    @Column(nullable = false)
    private String category;
    private String description;
    @Enumerated(EnumType.STRING)
    private Payment paymentMode;
    private String receiptURL;
    private String ocrData;
    private int fraudScore;

    @Enumerated(EnumType.STRING)
    private FraudLevel fraudLevel;

    @Enumerated(EnumType.STRING)
    private Status status;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @CreationTimestamp
    private LocalDateTime updatedAt;
}
