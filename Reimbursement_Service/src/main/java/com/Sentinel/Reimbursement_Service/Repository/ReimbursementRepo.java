package com.Sentinel.Reimbursement_Service.Repository;

import com.Sentinel.Reimbursement_Service.Entity.ReimbursementRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ReimbursementRepo extends JpaRepository<ReimbursementRequest, String> {
    List<ReimbursementRequest> findByEmployeeId(String employeeId);
}
