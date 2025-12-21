package com.Sentinel.Reimbursement_Service.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(indexes = {
        @Index(name = "idx_rh_vendor_date", columnList = "vendorName, expenseDate"),
        @Index(name = "idx_rh_vendor_date_amount", columnList = "vendorName, expenseDate, amount"),
        @Index(name = "idx_rh_emp_date", columnList = "employeeId, expenseDate"),
        @Index(name = "idx_rh_phash", columnList = "imagePhash"),
        @Index(name = "idx_rh_hash", columnList = "textHash"),
        @Index(name = "idx_rh_requestId", columnList = "reimbursementRequestId")
})
public class RequestHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String employeeId;

    private String invoiceNumber;
    @Column(nullable = false)
    private String vendorName;
    @Column(nullable = false)
    private Double amount;
    @Column(nullable = false)
    private LocalDate expenseDate;

    @Column(nullable = false)
    private long imagePhash;
    @Column(nullable = false)
    private long textHash;

    @Column(nullable = false)
    private String reimbursementRequestId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
