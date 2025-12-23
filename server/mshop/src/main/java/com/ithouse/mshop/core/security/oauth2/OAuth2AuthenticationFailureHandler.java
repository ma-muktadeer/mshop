package com.ithouse.mshop.core.security.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;

/**
 * Handles OAuth2 authentication failures
 * Redirects to login page with error message
 */
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);

    @Value("${application.ul.domain}")
    private List<String> frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {

        log.error("OAuth2 authentication failed", exception);

        String targetUrl = determineTargetUrl(exception);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String determineTargetUrl(AuthenticationException exception) {
        String redirectUri = frontendUrl.isEmpty() ? "http://localhost:4200" : frontendUrl.get(0);

        return UriComponentsBuilder.fromUriString(redirectUri + "/login")
                .queryParam("error", "oauth2_error")
                .queryParam("message", exception.getLocalizedMessage())
                .build()
                .toUriString();
    }
}
