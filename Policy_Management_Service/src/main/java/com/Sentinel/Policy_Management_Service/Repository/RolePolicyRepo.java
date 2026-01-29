package com.Sentinel.Policy_Management_Service.Repository;

import com.Sentinel.Policy_Management_Service.DTO.Role;
import com.Sentinel.Policy_Management_Service.Model.RolePolicyMapping;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolePolicyRepo extends JpaRepository<RolePolicyMapping, String> {
    Optional<RolePolicyMapping> findByRole(Role role);
    Optional<RolePolicyMapping> findByPolicyNumber(String policyNumber);

    boolean existsByRole(Role role);

    @Modifying
    @Transactional
    void deleteByPolicyNumber(String policyNumber);
}
