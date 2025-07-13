package com.ithouse.mshop.core.security;

import static java.util.stream.Collectors.joining;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import javax.crypto.SecretKey;

import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.utils.CoreUtils;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import com.ithouse.mshop.core.model.AccessTokenResponse;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

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
			String username = userPrincipal.getUsername();
			Collection<? extends GrantedAuthority> authorities = userPrincipal.getAuthorities();
			ClaimsBuilder claimsBuilder = Jwts.claims().subject(username);
			if (!authorities.isEmpty()) {
				claimsBuilder.add(AUTHORITIES_KEY,
						authorities.stream().map(GrantedAuthority::getAuthority)
								.collect(joining(",")));
			}

			HttpServletRequest request = null;
			ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            request = requestAttributes.getRequest();
            claimsBuilder.add("device", CoreUtils.generateDeviceFingerprint(request));
            Claims claims = claimsBuilder.build();
			Date now = Date.from(Instant.now());
			Date validity = Date.from(now.toInstant().plusMillis(jwtProperties.getValidityInMs()));
			String token = Jwts.builder()
					.claims(claims)
					.issuedAt(now)
					.expiration(validity)
//					.signWith(this.secretKey, Jwts.SIG.HS256)
					.signWith(secretKey)
					.compact();
			return new AccessTokenResponse(token, validity, "0000", "Success");

		} catch (Exception e) {
			log.error("Error generating auth token {}", e.getMessage());
			return new AccessTokenResponse("0001", "Authentication Failed");
		}
	}

	public boolean validateToken(String token, UserPrincipal userPrincipal) {
		Claims claims = getClaimsFromToken(token);
		if (!validateUsername(claims, userPrincipal)) {
			log.info("token is not valid for user {}", userPrincipal.getUsername());
			throw new IllegalArgumentException("invalid token");
		}

		return true;
	}

	public Authentication getAuthentication(String token) {
		Claims claims = Jwts.parser().verifyWith(this.secretKey).build().parseSignedClaims(token).getPayload();

		Object authoritiesClaim = claims.get(AUTHORITIES_KEY);

		Collection<? extends GrantedAuthority> authorities = authoritiesClaim == null ? AuthorityUtils.NO_AUTHORITIES
				: AuthorityUtils.commaSeparatedStringToAuthorityList(authoritiesClaim.toString());

		User principal = new User(claims.getSubject(), "", authorities);
		
		return new UsernamePasswordAuthenticationToken(principal, token, authorities);
	}

	private boolean validateUsername(Claims claims, UserPrincipal userPrincipal) {
		HttpServletRequest request = null;
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if(requestAttributes != null){
			request = requestAttributes.getRequest();
		}
		String tokenDeviceFingerprint = claims.get("device", String.class);
		return claims.getSubject().equals(userPrincipal.getUsername())
				&& StringUtils.hasLength(tokenDeviceFingerprint) && tokenDeviceFingerprint.equals(CoreUtils.generateDeviceFingerprint(request));
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
			throw new JwtException("Token expired.");
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

	public String getUsernameFromToken(String token) {
		return getClaimsFromToken(token).getSubject();
	}

}
