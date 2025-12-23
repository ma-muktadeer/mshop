package com.ithouse.mshop.core.security.oauth2;

import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.model.AccessTokenResponse;
import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.security.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

/**
 * Handles successful OAuth2 authentication
 * Generates JWT token and redirects to frontend with token
 */
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    @Value("${application.ul.domain}")
    private List<String> frontendUrl;

    private final AuthService authService;

    public OAuth2AuthenticationSuccessHandler(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) {

        OAuth2UserPrincipal oAuth2UserPrincipal = (OAuth2UserPrincipal) authentication.getPrincipal();
        User user = oAuth2UserPrincipal.getUser();

        // Generate JWT token for the OAuth2 user
        AccessTokenResponse tokenResponse;
        try {
            tokenResponse = authService.authenticateAndCreateToken(new UserPrincipal(user));
        } catch (NoSuchAlgorithmException e) {
            log.error("Failed to generate JWT token", e);
            return null;
        }

        // Build redirect URL with token
        String redirectUri = frontendUrl.isEmpty() ? "http://localhost:4200" : frontendUrl.get(0);

        return UriComponentsBuilder.fromUriString(redirectUri + "/login")
                .queryParam("token", tokenResponse.getAccessToken())
                .queryParam("expireOn", tokenResponse.getExpireOn())
                .queryParam("loginName", user.getLoginName())
                .build()
                .toUriString();
    }
}
