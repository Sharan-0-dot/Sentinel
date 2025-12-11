package com.Sentinel.Reimbursement_Service.Service;

import com.Sentinel.Reimbursement_Service.DTO.OCRdata;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AIService {

    private final GeminiService geminiService;

    public OCRdata extractOCRData(String ocrResult) {
        String prompt = createPromptForOCR(ocrResult);
        String rawResponse = geminiService.processOCRdata(prompt);
        log.info(rawResponse);
        return mapOCRdata(rawResponse);
    }

    public String createPromptForOCR(String text) {
        return """
    You are an information extraction engine.

    EXTRACT DATA AND RETURN ONLY A PURE JSON OBJECT.
    IMPORTANT RULES:
    - DO NOT return backticks.
    - DO NOT return fences like ```json or ``` anything.
    - DO NOT return explanations.
    - Return only a JSON object.
    - Every field must always exist, values can be null.

    JSON SCHEMA TO FOLLOW STRICTLY:

    {
      "amount": Double or null,
      "expenseDate": "YYYY-MM-DD" or null,
      "vendorName": String or null,
      "paymentMode": String or null,
      "address": String or null,
      "billNumber": String or null,
      "taxAmount": Double or null
    }

    Additional rules:
    - "paymentMode" must be one of: ["CASH", "CARD", "UPI", "CREDIT", "DEBIT"] or null.
    - Use ISO date format (YYYY-MM-DD).
    - If you are unsure, set the field to null.
    - Vendor name must be clean (no symbols or noise).

    OCR TEXT:
    <<<%s>>>
    """.formatted(text);
    }

    private OCRdata mapOCRdata(String rawResponse) throws RuntimeException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(rawResponse);

            JsonNode textNode = root.path("candidates")
                    .path(0)
                    .path("content")
                    .get("parts")
                    .get(0)
                    .get("text");

            if (textNode.isMissingNode()) {
                throw new RuntimeException("Gemini OCR response missing text field");
            }

            String jsonText = textNode.asText()
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            return mapper.readValue(jsonText, OCRdata.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini OCR JSON", e);
        }
    }
}
