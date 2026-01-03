package com.Sentinel.Policy_Management_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PolicyInfoDto {
    private String employeeId;
    private Double policyLimit;
}
