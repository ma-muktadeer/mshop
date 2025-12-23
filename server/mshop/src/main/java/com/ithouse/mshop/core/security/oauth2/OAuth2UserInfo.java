package com.ithouse.mshop.core.security.oauth2;

import java.util.Map;

/**
 * Interface to abstract OAuth2 user information from different providers
 */
public interface OAuth2UserInfo {
    
    /**
     * Get the unique ID from the OAuth provider
     */
    String getId();
    
    /**
     * Get the user's name
     */
    String getName();
    
    /**
     * Get the user's email
     */
    String getEmail();
    
    /**
     * Get the user's profile image URL
     */
    String getImageUrl();
}
