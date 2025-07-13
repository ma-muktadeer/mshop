package com.ithouse.mshop.core.security;



import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "jwt")
@Component
public class JwtProperties {

    private String secretKey = "rzxlszyykpbgqcflzxsqcysyhljt";

    // validity in milliseconds
    private long validityInMs = 3600000 * 24; // 1h * 24 (one day)

	public String getSecretKey() {
		return secretKey;
	}

	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}

	public long getValidityInMs() {
		return validityInMs;
	}

	public void setValidityInMs(long validityInMs) {
		this.validityInMs = validityInMs;
	}
    
    

}