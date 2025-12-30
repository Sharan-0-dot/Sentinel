package com.Sentinel.Policy_Management_Service.Repository;

import com.Sentinel.Policy_Management_Service.Model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyRepo extends JpaRepository<Policy, String> {

}
