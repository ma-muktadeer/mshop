package com.ithouse.mshop.core.principal;

import com.ithouse.mshop.core.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public record UserPrincipal(User user) implements UserDetails {


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream().map(m -> new SimpleGrantedAuthority(m.getRoleName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.getAllowLogin() != null && user.getAllowLogin() == 1;
    }

    @Override
    public boolean isEnabled() {
        return user.getActive() != null && user.getActive() == 1;
    }

}
