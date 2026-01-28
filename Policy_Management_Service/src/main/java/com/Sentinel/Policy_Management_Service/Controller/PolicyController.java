package com.Sentinel.Policy_Management_Service.Controller;

import com.Sentinel.Policy_Management_Service.DTO.PolicyDTO;
import com.Sentinel.Policy_Management_Service.Service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/policy")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService service;

    @GetMapping("/")
    public ResponseEntity<?> getAllPolicies() {
        try {
            return new ResponseEntity<>(service.getAllPolicies(), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> postPolicy(@RequestBody PolicyDTO policyDTO) {
        try {
            return new ResponseEntity<>(service.postPolicy(policyDTO), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updatePolicy(@RequestBody PolicyDTO policyDTO) {
        try {
            return new ResponseEntity<>(service.updatePolicy(policyDTO), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePolicy(@PathVariable String id) {
        try {
            return new ResponseEntity<>(service.deletePolicyById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
