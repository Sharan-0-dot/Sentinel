package com.Sentinel.Reimbursement_Service.Service;

import com.Sentinel.Reimbursement_Service.DTO.PolicyInfoDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmployeePolicyService {

    private final WebClient webClient;

    @Value("${policy.service.base-url}")
    private String policyServiceUrl;

    public EmployeePolicyService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Double getPolicyLimitOfUser(String employeeId) {
        PolicyInfoDto request = new PolicyInfoDto();
        request.setEmployeeId(employeeId);
        request.setPolicyLimit(0.0);
        PolicyInfoDto response = webClient.post()
                .uri(policyServiceUrl)
                .header("Content-Type", "application/json")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PolicyInfoDto.class)
                .block();

        return response.getPolicyLimit();
    }
}
