package com.Sentinel.Reimbursement_Service.Repository;

import com.Sentinel.Reimbursement_Service.Entity.ReimbursementRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface ReimbursementRepo extends JpaRepository<ReimbursementRequest, String> {

}
