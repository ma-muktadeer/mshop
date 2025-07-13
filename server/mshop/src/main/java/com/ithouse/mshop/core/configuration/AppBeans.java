package com.ithouse.mshop.core.configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

import com.ithouse.mshop.core.principal.UserPrincipalService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppBeans {

    private final UserPrincipalService userPrincipalService;

    public AppBeans(UserPrincipalService userPrincipalService) {
        this.userPrincipalService = userPrincipalService;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider
                .setPasswordEncoder(passwordEncoder());
        authProvider.setUserDetailsService(userPrincipalService);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }
    
    @Bean
    TaskExecutor taskExecutor() {
        try (ExecutorService executorService = Executors.newThreadPerTaskExecutor(new VirtualThreadFactory())) {
            return executorService::submit;
        }
    }

    static class VirtualThreadFactory implements ThreadFactory {
        @Override
        public Thread newThread(Runnable r) {
            return Thread.ofVirtual().start(r);
        }
    }

//    @Bean
//    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
//        return configuration.getAuthenticationManager();
//    }

}
