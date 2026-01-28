package com.Sentinel.Policy_Management_Service.Service;

import com.Sentinel.Policy_Management_Service.DTO.PolicyDTO;
import com.Sentinel.Policy_Management_Service.DTO.PolicyInfoDto;
import com.Sentinel.Policy_Management_Service.Model.Employee;
import com.Sentinel.Policy_Management_Service.Model.Policy;
import com.Sentinel.Policy_Management_Service.Model.RolePolicyMapping;
import com.Sentinel.Policy_Management_Service.Repository.EmployeeRepo;
import com.Sentinel.Policy_Management_Service.Repository.PolicyRepo;
import com.Sentinel.Policy_Management_Service.Repository.RolePolicyRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepo policyRepo;
    private final EmployeeRepo employeeRepo;
    private final RolePolicyRepo rolePolicyRepo;

    public PolicyInfoDto getUserLimit(PolicyInfoDto infoDto) {

        Employee employee = employeeRepo.findById(infoDto.getEmployeeId()).orElse(null);
        if(employee == null) throw new RuntimeException("No Employee Exists by employee id");
        String policyNumber = employee.getPolicyNumber();
        Policy policy = policyRepo.findById(policyNumber).orElse(null);
        if(policy == null) throw new RuntimeException("No policy exists by the given policy number");
        Double policyLimit = policy.getReimbursementLimit();
        PolicyInfoDto response = new PolicyInfoDto();
        response.setEmployeeId(infoDto.getEmployeeId());
        response.setPolicyLimit(policyLimit);

        return response;
    }

    public PolicyDTO postPolicy(PolicyDTO policyDTO) {
        if(policyRepo.existsByPolicyName(policyDTO.getPolicyName())) throw new RuntimeException("Policy name already exists");
        if(rolePolicyRepo.existsByRole(policyDTO.getRole())) throw new RuntimeException("Policy for role already exists");
        Policy policy = new Policy();
        policy.setPolicyName(policyDTO.getPolicyName());
        policy.setReimbursementLimit(policyDTO.getSpendingLimit());

        Policy saved = policyRepo.save(policy);

        RolePolicyMapping rolePolicyMapping = new RolePolicyMapping();
        rolePolicyMapping.setRole(policyDTO.getRole());
        rolePolicyMapping.setPolicyNumber(saved.getId());

        rolePolicyRepo.save(rolePolicyMapping);

        return policyDTO;
    }


    public PolicyDTO updatePolicy(PolicyDTO policyDTO) {
        Policy policy = policyRepo.findByPolicyName(policyDTO.getPolicyName())
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        if (!policy.getPolicyName().equals(policyDTO.getPolicyName()) &&
                policyRepo.existsByPolicyName(policyDTO.getPolicyName())) {
            throw new RuntimeException("Policy name already exists");
        }

        policy.setPolicyName(policyDTO.getPolicyName());
        policy.setReimbursementLimit(policyDTO.getSpendingLimit());
        policyRepo.save(policy);

        RolePolicyMapping mapping = rolePolicyRepo.findByPolicyNumber(policy.getId())
                .orElseThrow(() -> new RuntimeException("Role mapping not found"));

        mapping.setRole(policyDTO.getRole());
        rolePolicyRepo.save(mapping);

        return policyDTO;
    }

    public String deletePolicyById(String id) {
        Policy policy = policyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        rolePolicyRepo.deleteByPolicyNumber(policy.getId());
        policyRepo.deleteById(policy.getId());

        return "Policy deleted successfully";
    }

    public List<PolicyDTO> getAllPolicies() {
        List<RolePolicyMapping> list = rolePolicyRepo.findAll();
        List<PolicyDTO> result = new ArrayList<>();
        for(RolePolicyMapping rolePolicyMapping : list) {
            PolicyDTO dto = new PolicyDTO();
            dto.setRole(rolePolicyMapping.getRole());
            Policy policy = policyRepo.findById(rolePolicyMapping.getPolicyNumber()).orElse(null);
            if(policy == null) {
                continue;
            }
            dto.setId(policy.getId());
            dto.setPolicyName(policy.getPolicyName());
            dto.setSpendingLimit(policy.getReimbursementLimit());
            result.add(dto);
        }
        return result;
    }
}
