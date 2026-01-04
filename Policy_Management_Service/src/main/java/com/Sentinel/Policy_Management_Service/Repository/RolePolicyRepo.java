package com.Sentinel.Policy_Management_Service.Repository;

import com.Sentinel.Policy_Management_Service.DTO.Role;
import com.Sentinel.Policy_Management_Service.Model.RolePolicyMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolePolicyRepo extends JpaRepository<RolePolicyMapping, String> {
    Optional<RolePolicyMapping> findByRole(Role role);
    Optional<RolePolicyMapping> findByPolicyNumber(String policyNumber);

    boolean existsByRole(Role role);
    void deleteByPolicyNumber(String policyNumber);
}
