package com.Sentinel.Reimbursement_Service.Repository;

import com.Sentinel.Reimbursement_Service.Entity.ReimbursementRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReimbursementRepo extends JpaRepository<ReimbursementRequest, String> {
}
