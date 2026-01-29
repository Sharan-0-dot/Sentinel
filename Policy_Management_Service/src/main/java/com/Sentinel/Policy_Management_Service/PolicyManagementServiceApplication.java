package com.Sentinel.Policy_Management_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class PolicyManagementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PolicyManagementServiceApplication.class, args);
	}

}
