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
        @Index(name = "idx_rh_vendor", columnList = "vendorName"),
        @Index(name = "idx_rh_invoice", columnList = "invoiceNumber"),
        @Index(name = "idx_rh_phash", columnList = "imagePhash"),
        @Index(name = "idx_rh_thash", columnList = "textHash"),
        @Index(name = "idx_rh_requestId", columnList = "reimbursementRequestId")
})
public class RequestHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String invoiceNumber;
    @Column(nullable = false)
    private String vendorName;
    @Column(nullable = false)
    private Double amount;
    @Column(nullable = false)
    private LocalDate expenseDate;
    private String imagePhash;
    private String textHash;

    @Column(nullable = false)
    private String reimbursementRequestId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
