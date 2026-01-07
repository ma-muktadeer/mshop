package com.ithouse.mshop;

import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.service.UserService;
import jakarta.el.ELException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class InnitialValue implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(InnitialValue.class);

    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            if (userService.isEmptyUser()) {
                User usr = new User();
                usr.setEmail("ithousebd@admin.com");
                usr.setLoginName("ithousebd");
                usr.setPhoneNumber("01763070997");
                usr.setFirstName("IT house");
                usr.setAppName("M-SHOP");
                usr.setAllowLogin(1);
                // usr.setUserId(1L);
                usr.setPassword(passwordEncoder.encode("123"));
                usr.setCreatorId(1L);
                usr.setUserModId(1L);

                Role rl = new Role();
                // rl.setRoleId(1L);
                rl.setRoleName("SUPER_ADMIN");
                rl.setDisplayName("Super Admin");
                rl.setCreatorId(1L);
                rl.setUserModId(1L);
//                roleService.saveRole(new HashSet<>(Collections.singletonList(rl)));
                // usr.setRoles(Collections.singletonList(rl));
                usr.setRoles(Set.of(rl));
//                usr.setRoles(new HashSet<>(Collections.singletonList(rl)));

                userService.saveInitialValue(usr);
            }

        } catch (Exception e) {
            log.info("getting error to save initioal vaule=[{}]", e.getMessage());
            throw new ELException(e.getMessage());
        }
    }

}
