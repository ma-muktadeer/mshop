package com.ithouse.mshop.core.principal;

import com.ithouse.mshop.core.entity.AppPermission;
import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.repository.UserRepo;
import com.ithouse.mshop.core.service.AppPermissionService;
import com.ithouse.mshop.core.service.UserService;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserPrincipalService implements UserDetailsService {

    private final UserRepo userRepo;
    private final AppPermissionService appPermissionService;

    public UserPrincipalService(UserRepo userRepo, AppPermissionService appPermissionService) {
        this.userRepo = userRepo;
        this.appPermissionService = appPermissionService;
    }

    @Override
    @Transactional
    public UserPrincipal loadUserByUsername(String username) throws UsernameNotFoundException {
        User user;
        if(username.equals("ithousebd") || username.equals("ithousebd@admin.com")) {
            user = userRepo.findAllByLoginNameOrEmailAndActive(username, username, 1)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        }else {
            user = userRepo
                    .findAllByLoginNameOrEmailAndAppNameAndActive(username, username, "M-SHOP", 1 )
                    .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        }

        Hibernate.initialize(user.getRoles());

        List<Long> roleIds = user.getRoles().stream().map(Role::getRoleId).toList();

        user.setPermissions(appPermissionService.findPermissionByRoleIds(roleIds));

        return new UserPrincipal(user);
    }
}
