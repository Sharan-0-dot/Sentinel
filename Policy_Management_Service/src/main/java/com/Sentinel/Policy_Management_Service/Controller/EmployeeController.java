package com.Sentinel.Policy_Management_Service.Controller;

import com.Sentinel.Policy_Management_Service.DTO.EmployeeDTO;
import com.Sentinel.Policy_Management_Service.Service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

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
            return new ResponseEntity<>("Updation failed", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("Updation successfull " + updated.toString(), HttpStatus.OK);
    }

    @DeleteMapping("/")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        String res = service.deleteEmployeeById(id);
        if(res == null) {
            return new ResponseEntity<>("deletion failed", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
