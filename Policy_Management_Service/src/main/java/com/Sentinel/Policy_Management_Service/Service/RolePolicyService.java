package com.Sentinel.Policy_Management_Service.Service;

import com.Sentinel.Policy_Management_Service.DTO.Role;
import com.Sentinel.Policy_Management_Service.Repository.RolePolicyRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RolePolicyService {

    private final RolePolicyRepo repo;

    public String resolvePolicyForRole(Role role) throws RuntimeException{
        return repo.findByRole(role).orElseThrow(() -> new RuntimeException("No policy mapped for role")).getPolicyNumber();
    }
}
