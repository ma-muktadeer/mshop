package com.ithouse.mshop.core.security;

import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.principal.UserPrincipalService;
import com.ithouse.mshop.core.security.service.AuthService;
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
    public void doFilterInternal(HttpServletRequest req, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String token = resolveToken((HttpServletRequest) req);
        log.debug("Getting bear toke from httpServletRequest: {}", token);

        if (!StringUtils.hasLength(token)) {
            if (req.getRequestURI().contains("/public")) {
                chain.doFilter(req, response);
            } else {
                response.getWriter().write("Access denied. Unauthorized request.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
            return;
        }
        String userAgent = req.getHeader("User-Agent");

        if (!StringUtils.hasText(req.getHeader("appName")) || !req.getHeader("appName").equals("M-SHOP")) {
            log.warn("Blocked request with app name: {}", req.getHeader("appName"));
            response.getWriter().write("Access denied. Unauthorized request.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        if (!isBrowser.apply(userAgent)) {
            log.warn("Blocked request with non-browser User-Agent: {}", userAgent);
            response.getWriter().write("Access denied. Unauthorized request.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String username = authService.findUsernameByToken(token);
        if (username == null) {
            chain.doFilter(req, response);
            return;
        }
        UserPrincipal userPrincipal = userPrincipalService.loadUserByUsername(username);
        if (userPrincipal == null) {
            chain.doFilter(req, response);
            return;
        }

        boolean isAuth = authService.validateToken(token, userPrincipal);
        if (!isAuth) {
            log.warn("Invalid token: {}", token);
            response.getWriter().write("Access denied. Unauthorized request.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userPrincipal.getUsername(), userPrincipal.getPassword(), userPrincipal.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        chain.doFilter(req, response);
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
