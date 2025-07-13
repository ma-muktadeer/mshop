package com.ithouse.mshop.core.principal;

import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.repository.UserRepo;
import com.ithouse.mshop.core.service.UserService;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserPrincipalService implements UserDetailsService {

    private final UserRepo userRepo;

    public UserPrincipalService( UserRepo userRepo) {
        this.userRepo = userRepo;
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

//        Hibernate.initialize(user.getRoles());
        Hibernate.initialize(user.getRoles());


        return new UserPrincipal(user);
    }
}
