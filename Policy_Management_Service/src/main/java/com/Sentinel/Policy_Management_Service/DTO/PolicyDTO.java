package com.Sentinel.Policy_Management_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PolicyDTO {
    private String id;
    private String policyName;
    private Double spendingLimit;
    private Role role;
}
