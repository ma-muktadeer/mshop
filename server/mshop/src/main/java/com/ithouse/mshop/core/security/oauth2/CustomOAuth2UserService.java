package com.ithouse.mshop.core.security.oauth2;

import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.repository.UserRepo;
import com.ithouse.mshop.core.service.RoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

/**
 * Custom OAuth2 user service to load or create users from OAuth2 providers
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger log = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final UserRepo userRepository;
    private final RoleService roleService;

    public CustomOAuth2UserService(UserRepo userRepository, RoleService roleService) {
        this.userRepository = userRepository;
        this.roleService = roleService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            log.error("Error processing OAuth2 user", ex);
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        User user = findOrCreateUser(oAuth2UserInfo, registrationId);

        return new OAuth2UserPrincipal(user, oAuth2User.getAttributes());
    }

    private OAuth2UserInfo getOAuth2UserInfo(String registrationId, java.util.Map<String, Object> attributes) {
        if ("google".equalsIgnoreCase(registrationId)) {
            return new GoogleOAuth2UserInfo(attributes);
        }
        // Add other providers here in the future (Facebook, GitHub, etc.)
        throw new OAuth2AuthenticationException("Unsupported OAuth2 provider: " + registrationId);
    }

    private User findOrCreateUser(OAuth2UserInfo oAuth2UserInfo, String provider) {
        // First, try to find by OAuth provider ID
        Optional<User> userOptional = userRepository.findByOauthProviderAndOauthProviderId(
                provider.toUpperCase(), oAuth2UserInfo.getId());

        if (userOptional.isPresent()) {
            // User exists with this OAuth provider
            User user = userOptional.get();
            updateExistingUser(user, oAuth2UserInfo);
            return userRepository.save(user);
        }

        // Second, try to find by email
        userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());

        if (userOptional.isPresent()) {
            // User exists with this email, link OAuth provider to existing account
            User user = userOptional.get();
            user.setOauthProvider(provider.toUpperCase());
            user.setOauthProviderId(oAuth2UserInfo.getId());
            updateExistingUser(user, oAuth2UserInfo);
            return userRepository.save(user);
        }

        // Create new user
        return createNewUser(oAuth2UserInfo, provider);
    }

    private void updateExistingUser(User user, OAuth2UserInfo oAuth2UserInfo) {
        // Update user information from OAuth provider
        if (StringUtils.hasText(oAuth2UserInfo.getName())) {
            user.setFullName(oAuth2UserInfo.getName());
        }
        if (StringUtils.hasText(oAuth2UserInfo.getImageUrl())) {
            user.setProfileImagePath(oAuth2UserInfo.getImageUrl());
        }
    }

    private User createNewUser(OAuth2UserInfo oAuth2UserInfo, String provider) {
        User newUser = new User();

        // Set OAuth provider information
        newUser.setOauthProvider(provider.toUpperCase());
        newUser.setOauthProviderId(oAuth2UserInfo.getId());

        // Set basic information
        newUser.setEmail(oAuth2UserInfo.getEmail());
        newUser.setLoginName(oAuth2UserInfo.getEmail()); // Use email as login name
        newUser.setFullName(oAuth2UserInfo.getName());
        newUser.setProfileImagePath(oAuth2UserInfo.getImageUrl());

        // Set default values
        newUser.setAppName("MSHOP");
        newUser.setAllowLogin(1); // Allow login by default
        newUser.setPassExpired(0);
        newUser.setTwoFactorAuth(0);
        newUser.setLogingMethod("OAUTH2");

        // No password needed for OAuth users (but make it nullable check safe)
        newUser.setPassword(null);

        // Assign default role
        try {
            Set<Role> userRoles = roleService.findByRoleName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Default user role not found"));
            newUser.setRoles(userRoles);
        } catch (Exception e) {
            log.error("Error setting default role for OAuth user", e);
            // Continue without role if not found
            newUser.setRoles(new HashSet<>());
        }

        return userRepository.save(newUser);
    }
}
