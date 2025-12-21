package com.Sentinel.Reimbursement_Service.FraudDetectionEngine;

import org.springframework.stereotype.Service;

@Service
public class TextHashService {

    private static final int HASH_BITS = 64;

    public long generateHash(String ocrResult) {
        if (ocrResult == null || ocrResult.isBlank()) {
            return 0L;
        }

        String normalized = normalize(ocrResult);

        String[] tokens = normalized.split("\\s+");

        int[] bitVector = new int[HASH_BITS];

        for (String token : tokens) {
            if (token.length() < 2) continue;

            long hash = hashToken(token);

            int weight = getTokenWeight(token);

            for (int i = 0; i < HASH_BITS; i++) {
                if (((hash >> i) & 1) == 1) {
                    bitVector[i] += weight;
                } else {
                    bitVector[i] -= weight;
                }
            }
        }

        long simHash = 0L;
        for (int i = 0; i < HASH_BITS; i++) {
            if (bitVector[i] > 0) {
                simHash |= (1L << i);
            }
        }

        return simHash;
    }

    private String normalize(String text) {
        return text
                .toLowerCase()
                .replaceAll("[^a-z0-9. ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private long hashToken(String token) {
        final long FNV_64_PRIME = 0x100000001b3L;
        long hash = 0xcbf29ce484222325L;

        for (int i = 0; i < token.length(); i++) {
            hash ^= token.charAt(i);
            hash *= FNV_64_PRIME;
        }

        return hash;
    }

    private int getTokenWeight(String token) {

        // Amount-like tokens
        if (token.matches("\\d+\\.\\d{2}")) {
            return 5;
        }

        // Date-like tokens
        if (token.matches("\\d{2}/\\d{2}/\\d{4}") ||
                token.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return 4;
        }

        // Merchant words (heuristic)
        if (token.length() > 4 && token.matches("[a-z]+")) {
            return 2;
        }

        return 1;
    }

    public int hammingDistance(long h1, long h2) {
        return Long.bitCount(h1 ^ h2);
    }

}
