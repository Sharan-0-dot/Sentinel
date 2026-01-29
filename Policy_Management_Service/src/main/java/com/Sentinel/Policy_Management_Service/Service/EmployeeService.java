package com.Sentinel.Policy_Management_Service.Service;

import com.Sentinel.Policy_Management_Service.DTO.EmployeeDTO;
import com.Sentinel.Policy_Management_Service.Model.Employee;
import com.Sentinel.Policy_Management_Service.Repository.EmployeeRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private final EmployeeRepo employeeRepo;
    private final RolePolicyService rolePolicyService;

    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        try {
            Employee employee = Employee.builder()
                    .name(employeeDTO.getName())
                    .role(employeeDTO.getRole())
                    .policyNumber(rolePolicyService.resolvePolicyForRole(employeeDTO.getRole()))
                    .build();
            Employee saved = employeeRepo.save(employee);
            employeeDTO.setId(saved.getId());
            return employeeDTO;
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public String deleteEmployeeById(String id) {
        try {
            employeeRepo.deleteById(id);
            return "Employee deleted Successfully";
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public EmployeeDTO updateEmployee(EmployeeDTO employeeDTO) {
        try {
            Employee alreadySaved = employeeRepo.findById(employeeDTO.getId()).orElse(null);
            if(alreadySaved == null) {
                throw new Exception("no Employee exists by this id");
            }
            if(employeeDTO.getName() != null && employeeDTO.getRole() != null) {
                alreadySaved.setName(employeeDTO.getName());
                alreadySaved.setRole(employeeDTO.getRole());
            }
            employeeRepo.save(alreadySaved);
            return employeeDTO;
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public List<EmployeeDTO> getAllEmployee() {
        List<EmployeeDTO> result = new ArrayList<>();
        for(Employee employee : employeeRepo.findAll()) {
            EmployeeDTO dto = new EmployeeDTO();
            dto.setId(employee.getId());
            dto.setName(employee.getName());
            dto.setRole(employee.getRole());
            result.add(dto);
        }
        return result;
    }

    public EmployeeDTO getEmployeeByName(String name) {
        Employee employee = employeeRepo.findByName(name).orElse(null);
        if(employee == null) throw new RuntimeException("Employee not found");
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setRole(employee.getRole());
        return dto;
    }


}
