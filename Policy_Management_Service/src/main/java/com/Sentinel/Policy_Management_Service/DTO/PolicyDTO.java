package com.Sentinel.Policy_Management_Service.DTO;

import lombok.Data;

@Data
public class PolicyDTO {
    private String policyName;
    private Double spendingLimit;
    private Role role;
}
