package com.ithouse.mshop.core.security;

import com.ithouse.mshop.core.model.AccessTokenResponse;
import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.utils.CoreUtils;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;

import static java.util.stream.Collectors.joining;

@Component
public class JwtTokenProvider {
	private static final Logger log = LogManager.getLogger();

	private static final String AUTHORITIES_KEY = "roles";

	private final JwtProperties jwtProperties;

	private SecretKey secretKey;

	public JwtTokenProvider(JwtProperties jwtProperties) {
		super();
		this.jwtProperties = jwtProperties;
	}

	@PostConstruct
	public void init() {
		String secret = Base64.getEncoder().encodeToString(this.jwtProperties.getSecretKey().getBytes());
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	public AccessTokenResponse createToken(UserPrincipal userPrincipal) {
		try {
			// Extract username and authorities
			String username = userPrincipal.getUsername();
			Collection<? extends GrantedAuthority> authorities = userPrincipal.getAuthorities();

			// Build base claims
			ClaimsBuilder claimsBuilder = Jwts.claims().subject(username);
			claimsBuilder.add("id", userPrincipal.getId());

			if (authorities != null && !authorities.isEmpty()) {
				String roles = authorities.stream()
						.map(GrantedAuthority::getAuthority)
						.collect(joining(","));
				claimsBuilder.add(AUTHORITIES_KEY, roles);
			}

			// Add device fingerprint if available (null-safe)
			ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
			if (attrs != null) {
				HttpServletRequest request = attrs.getRequest();
				claimsBuilder.add("device", CoreUtils.generateDeviceFingerprint(request));
			}

			Claims claims = claimsBuilder.build();

			// Token timing
			Date now = new Date();
			Date expiry = new Date(now.getTime() + jwtProperties.getValidityInMs());

			// Build JWT token
			String token = Jwts.builder()
					.claims(claims)
					.issuedAt(now)
					.expiration(expiry)
					.signWith(secretKey)
					.compact();

			return new AccessTokenResponse(token, expiry, "0000", "Success");

		} catch (Exception e) {
			log.error("Error generating auth token", e);
			return new AccessTokenResponse("0001", "Authentication Failed");
		}
	}

	public boolean validateToken(Claims claims, UserPrincipal userPrincipal) {
		if (!validateUsername(claims, userPrincipal)) {
			log.info("token is not valid for user {}", userPrincipal.getUsername());
			throw new JwtException("invalid token");
		}

		return true;
	}

	private boolean validateUsername(Claims claims, UserPrincipal userPrincipal) {
		HttpServletRequest request = null;
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes();
		if (requestAttributes != null) {
			request = requestAttributes.getRequest();
		}
		assert request != null;
		Long tokenUserId = claims.get("id", Long.class);
		if (tokenUserId == null || !tokenUserId.equals(userPrincipal.getId())) {
			return false;
		}
		String tokenDeviceFingerprint = claims.get("device", String.class);
		if (!claims.getSubject().equals(userPrincipal.getUsername())
				|| !StringUtils.hasLength(tokenDeviceFingerprint))
			return false;
		return tokenDeviceFingerprint.equals(CoreUtils.generateDeviceFingerprint(request));
	}

	private Claims getClaimsFromToken(String token) {
		Claims claims = null;
		try {
			claims = Jwts
					.parser()
					.verifyWith(secretKey)
					.build()
					.parseSignedClaims(token)
					.getPayload();

		} catch (ExpiredJwtException e) {
			log.error("Token expired: {}", e.getMessage());
			throw e;
		} catch (SignatureException e) {
			log.error("Invalid token signature: {}", e.getMessage());
			throw new JwtException("Invalid token.");
		} catch (MalformedJwtException e) {
			log.error("Malformed token: {}", e.getMessage());
			throw new JwtException("Invalid token.");
		} catch (Exception e) {
			log.error("Token parsing error: {}", e.getMessage());
			throw new JwtException("Invalid token.");
		}
		return claims;
	}

	public Claims getUsernameFromToken(String token) {
		return getClaimsFromToken(token);
	}

}
