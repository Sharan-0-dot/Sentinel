package com.Sentinel.Reimbursement_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class ReimbursementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReimbursementServiceApplication.class, args);
	}

}
