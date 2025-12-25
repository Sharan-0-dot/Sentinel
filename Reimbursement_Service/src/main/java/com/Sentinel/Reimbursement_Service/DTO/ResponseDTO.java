package com.Sentinel.Reimbursement_Service.DTO;

import lombok.Data;

@Data
public class ResponseDTO {
    private int fraudScore;
    private StringBuilder description = new StringBuilder();

    public void addScore(int score) {
        this.fraudScore += score;
    }

    public void addReason(String reason) {
        this.description.append(reason).append(" | ");
    }

    public String getFinalDescription() {
        return description.toString();
    }
}
