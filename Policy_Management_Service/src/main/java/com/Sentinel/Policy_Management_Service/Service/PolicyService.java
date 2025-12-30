package com.Sentinel.Policy_Management_Service.Service;

import com.Sentinel.Policy_Management_Service.Repository.PolicyRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PolicyService {
    private final PolicyRepo policyRepo;
}
