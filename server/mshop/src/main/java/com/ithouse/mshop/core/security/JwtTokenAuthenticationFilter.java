package com.ithouse.mshop.core.security;

import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.principal.UserPrincipalService;
import com.ithouse.mshop.core.security.service.AuthService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.function.Function;

@Component
public class JwtTokenAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LogManager.getLogger();
    public static final String HEADER_PREFIX = "Bearer ";

    private final AuthService authService;
    private final UserPrincipalService userPrincipalService;

    public JwtTokenAuthenticationFilter(AuthService authService, UserPrincipalService userPrincipalService) {
        super();
        this.authService = authService;
        this.userPrincipalService = userPrincipalService;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {

        try {
            String token = resolveToken(request);
            log.debug("Extracted bearer token from request: {}", token);

            // Allow public endpoints without authentication
            if (!StringUtils.hasText(token)) {
                if (request.getRequestURI().contains("/public")) {
                    chain.doFilter(request, response);
                } else {
                    sendUnauthorizedResponse(response, "Access denied. Unauthorized request.", HttpServletResponse.SC_BAD_REQUEST);
                }
                return;
            }

            // Validate required headers
            String appName = request.getHeader("appName");
            if (!"M-SHOP".equals(appName)) {
                log.warn("Blocked request with invalid appName header: {}", appName);
                sendUnauthorizedResponse(response, "Access denied. Unauthorized request.", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            String userAgent = request.getHeader("User-Agent");
            if (!isBrowser.apply(userAgent)) {
                log.warn("Blocked request with non-browser User-Agent: {}", userAgent);
                sendUnauthorizedResponse(response, "Access denied. Unauthorized request.", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Validate token and load user
            Claims claims = authService.findUsernameByToken(token);

            String username = claims.getSubject();
            if (username == null) {
                chain.doFilter(request, response);
                return;
            }

            UserPrincipal userPrincipal = userPrincipalService.loadUserByUsername(username);
            if (userPrincipal == null) {
                chain.doFilter(request, response);
                return;
            }

            if (!authService.validateToken(claims, userPrincipal)) {
                log.warn("Invalid token for user {}: {}", username, token);
                sendUnauthorizedResponse(response, "Access denied. Unauthorized request.", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Build authentication object and set security context
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userPrincipal,
                            null,
                            userPrincipal.getAuthorities()
                    );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            chain.doFilter(request, response);

        }
        catch (ExpiredJwtException e){
            log.error("Token expired", e);
            sendUnauthorizedResponse(response, "Token Expired.", 1001);
        }
        catch (Exception e) {
            log.error("Error in authentication filter", e);
            sendUnauthorizedResponse(response, "Internal authentication error.", HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message, int status) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(status);
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }

    Function<String, Boolean> isBrowser = (userAgent) -> {
        if (!StringUtils.hasLength(userAgent)) {
            return false;
        } else {
            return userAgent.contains("Mozilla") ||
                    userAgent.contains("Chrome") ||
                    userAgent.contains("Safari") ||
                    userAgent.contains("Firefox") ||
                    userAgent.contains("Edge");
        }
    };


    private String resolveToken(HttpServletRequest req) {

        String bearerToken = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(HEADER_PREFIX)) {
            return bearerToken.substring(7);
        }

        return null;
    }

}
