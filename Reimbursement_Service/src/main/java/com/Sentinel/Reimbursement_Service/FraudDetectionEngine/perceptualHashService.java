package com.Sentinel.Reimbursement_Service.FraudDetectionEngine;

import dev.brachtendorf.jimagehash.hash.Hash;
import dev.brachtendorf.jimagehash.hashAlgorithms.PerceptiveHash;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;

@Service
public class perceptualHashService {
    private final PerceptiveHash pHash = new PerceptiveHash(64);

    public String generatePhash(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {

            BufferedImage image = ImageIO.read(inputStream);
            if (image == null) {
                throw new RuntimeException("Invalid image or unsupported format");
            }

            Hash hash = pHash.hash(image);

            return hash.getHashValue().toString(16);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate perceptual hash", e);
        }
    }

    public int hammingDistance(String hash1, String hash2) {
        long h1 = Long.parseUnsignedLong(hash1, 16);
        long h2 = Long.parseUnsignedLong(hash2, 16);
        return Long.bitCount(h1 ^ h2);
    }
}
