package com.Sentinel.Reimbursement_Service.Repository;

import com.Sentinel.Reimbursement_Service.Entity.RequestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReimbursementHistoryRepo extends JpaRepository<RequestHistory, String> {
    boolean existsByVendorNameAndExpenseDate(String vendorName, LocalDate expenseDate);
    boolean existsByVendorNameAndExpenseDateAndAmount(String vendorName, LocalDate expenseDate, Double amount);

    @Query("SELECT r.imagePhash FROM RequestHistory r")
    List<Long> findAllImagePhashes();

    @Query("SELECT r.textHash FROM RequestHistory r")
    List<Long> findAllTextHashes();

    List<RequestHistory> findByEmployeeIdAndExpenseDate(String employeeId, LocalDate expenseDate);
}
