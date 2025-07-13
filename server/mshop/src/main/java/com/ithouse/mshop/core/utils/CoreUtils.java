package com.ithouse.mshop.core.utils;


import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class CoreUtils {

    private static final Logger log = LoggerFactory.getLogger(CoreUtils.class);

    public static String generateDeviceFingerprint(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String acceptLanguage = request.getHeader("Accept-Language");
        String referer = request.getHeader("Referer");

        String rawFingerprint = ipAddress + ":" + userAgent + ":" + acceptLanguage + ":" + referer;

        return hashFingerPrint(rawFingerprint);
    }

    private static String hashFingerPrint(String rawFingerprint) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return Base64.getEncoder().encodeToString(digest.digest(rawFingerprint.getBytes()));
        } catch (NoSuchAlgorithmException e) {
            log.error("Error while hashing fingerprint: {}", e.getMessage());
            return rawFingerprint;
        }
    }
}
