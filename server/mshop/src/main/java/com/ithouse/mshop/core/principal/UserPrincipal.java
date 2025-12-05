package com.ithouse.mshop.core.principal;

import com.ithouse.mshop.core.entity.AppPermission;
import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record UserPrincipal(User user) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<String> roles = user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toSet());
        if (roles.isEmpty()) {
            roles.add("ROLE_USER");
        }
        return roles.stream().map(SimpleGrantedAuthority::new)
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
        return user.getActive() == 1;
    }

    public Long getId() {
        return user.getUserId();
    }

    public String getLoginName() {
        return user.getLoginName();
    }

    public List<AppPermission> getPermissions() {
        return user.getPermissions();
    }
}
