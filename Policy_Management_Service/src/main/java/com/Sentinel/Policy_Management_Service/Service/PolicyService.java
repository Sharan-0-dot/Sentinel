package com.Sentinel.Policy_Management_Service.Service;

import com.Sentinel.Policy_Management_Service.DTO.PolicyInfoDto;
import com.Sentinel.Policy_Management_Service.Model.Employee;
import com.Sentinel.Policy_Management_Service.Model.Policy;
import com.Sentinel.Policy_Management_Service.Repository.EmployeeRepo;
import com.Sentinel.Policy_Management_Service.Repository.PolicyRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepo policyRepo;
    private final EmployeeRepo employeeRepo;

    public PolicyInfoDto getUserLimit(PolicyInfoDto infoDto) {

        Employee employee = employeeRepo.findById(infoDto.getEmployeeId()).orElse(null);
        if(employee == null) throw new RuntimeException("No Employee Exists by employee id");
        String policyNumber = employee.getPolicyNumber();
        Policy policy = policyRepo.findByPolicyNumber(policyNumber).orElse(null);
        if(policy == null) throw new RuntimeException("No policy exists by the given policy number");
        Double policyLimit = policy.getReimbursementLimit();
        PolicyInfoDto response = new PolicyInfoDto();
        response.setEmployeeId(infoDto.getEmployeeId());
        response.setPolicyLimit(policyLimit);

        return response;
    }
}
