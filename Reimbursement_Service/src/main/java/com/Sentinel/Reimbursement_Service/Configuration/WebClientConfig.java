package com.Sentinel.Reimbursement_Service.Configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient ocrClient(WebClient.Builder webClientBuilder, @Value("${ocrBaseUrl}") String url) {
        return webClientBuilder.baseUrl(url).build();
    }
}
