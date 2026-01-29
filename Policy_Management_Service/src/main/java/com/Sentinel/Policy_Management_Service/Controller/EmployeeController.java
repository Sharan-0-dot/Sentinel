package com.Sentinel.Policy_Management_Service.Controller;

import com.Sentinel.Policy_Management_Service.DTO.EmployeeDTO;
import com.Sentinel.Policy_Management_Service.DTO.PolicyInfoDto;
import com.Sentinel.Policy_Management_Service.Service.EmployeeService;
import com.Sentinel.Policy_Management_Service.Service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;
    private final PolicyService policyService;

    @GetMapping("/{name}")
    public ResponseEntity<?> getEmployeeByName(@PathVariable String name) {
        try {
            return new ResponseEntity<>(service.getEmployeeByName(name), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllEmployee() {
        return new ResponseEntity<>(service.getAllEmployee(), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO created = service.createEmployee(employeeDTO);
        if(created == null) {
            return new ResponseEntity<>("Employee creation failed", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("Employee created Successfully " + created.toString(), HttpStatus.OK);
    }

    @PutMapping("/")
    public ResponseEntity<?> updateEmployee(@RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO updated = service.updateEmployee(employeeDTO);
        if(updated == null) {
            return new ResponseEntity<>("update failed", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("update successfull " + updated.toString(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        String res = service.deleteEmployeeById(id);
        if(res == null) {
            return new ResponseEntity<>("deletion failed", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/policy_limit")
    public ResponseEntity<?> getPolicyLimitOfUser(@RequestBody PolicyInfoDto infoDto) {
        try {
            PolicyInfoDto response = policyService.getUserLimit(infoDto);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
