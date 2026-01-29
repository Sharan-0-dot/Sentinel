package com.Sentinel.Policy_Management_Service.Repository;

import com.Sentinel.Policy_Management_Service.Model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, String> {
    Optional<Employee> findByName(String name);
}
