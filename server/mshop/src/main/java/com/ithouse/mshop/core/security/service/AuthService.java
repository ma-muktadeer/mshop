package com.ithouse.mshop.core.security.service;

import com.ithouse.mshop.core.model.AccessTokenResponse;
import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public Authentication authenticate(String username, String password) {
        try {
            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        }catch (BadCredentialsException e) {
            log.info("Username or password is incorrect");
            throw new BadCredentialsException("Invalid username or password");
        }
    }


    public AccessTokenResponse authenticateAndCreateToken(UserPrincipal userPrincipal) throws NoSuchAlgorithmException {

//        Authentication authentication = authenticate(userPrincipal.getUsername(), userPrincipal.getPassword());
//        if (authentication.isAuthenticated()) {
//            return jwtTokenProvider.createToken(authentication);
//        }
        return jwtTokenProvider.createToken(userPrincipal);
    }

    public String findUsernameByToken(String token) {
        return jwtTokenProvider.getUsernameFromToken(token);
    }

    public boolean validateToken(String token, UserPrincipal userPrincipal) {
        return jwtTokenProvider.validateToken(token, userPrincipal);
    }
}
