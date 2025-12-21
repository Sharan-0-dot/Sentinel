package com.Sentinel.Reimbursement_Service.FraudDetectionEngine;

import dev.brachtendorf.jimagehash.hash.Hash;
import dev.brachtendorf.jimagehash.hashAlgorithms.PerceptiveHash;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;

@Service
public class PerceptualHashService {
    private final PerceptiveHash pHash = new PerceptiveHash(64);

    public long generatePhash(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            BufferedImage image = ImageIO.read(inputStream);
            Hash hash = pHash.hash(image);
            return hash.getHashValue().longValue();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate perceptual hash", e);
        }
    }


    public int hammingDistance(long h1, long h2) {
        return Long.bitCount(h1 ^ h2);
    }

}
