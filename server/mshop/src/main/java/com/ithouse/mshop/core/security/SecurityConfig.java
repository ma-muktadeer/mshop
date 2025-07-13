package com.ithouse.mshop.core.security;

import com.ithouse.mshop.core.service.RoleService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.security.web.util.matcher.RequestHeaderRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${application.ul.domain}")
    private List<String> applicationDomain;

    @Value("${security.csp.report-only}")
    private boolean cspReportOnly;

    @Value("${security.hsts.enabled}")
    private boolean hstsEnabled;

    @Value("${security.script-inline-allowed}")
    private boolean scriptInlineAllowed;

    @Value("${security.allowed-method}")
    private List<String> allowedMethod;


    private final RoleService roleService;
    private final JwtTokenAuthenticationFilter jwtTokenAuthenticationFilter;
    private final Environment env;

    public SecurityConfig(RoleService roleService, JwtTokenAuthenticationFilter jwtTokenAuthenticationFilter, Environment env) {
        this.roleService = roleService;
        this.jwtTokenAuthenticationFilter = jwtTokenAuthenticationFilter;
        this.env = env;
    }

    @Bean
    SecurityFilterChain springWebFilterChain(HttpSecurity http) throws Exception {
        if (env.acceptsProfiles(Profiles.of("prod"))) {
            http.requiresChannel(rc -> rc.anyRequest().requiresSecure()
            );
        }
        return http
                .headers(this::headersFilter)
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers("/**"))
                .addFilterBefore(jwtTokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
//                .sessionManagement(c -> c.sessionCreationPolicy(SeassionCreationPolicy.STATELESS))
                .sessionManagement(c -> c.sessionFixation()
                                .migrateSession()
                                .invalidSessionUrl("/public/login?invalid-session=true")
                                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                                .maximumSessions(1)
                                .maxSessionsPreventsLogin(true)
                        )
                .exceptionHandling(e ->
                        e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .authorizeHttpRequests(r -> r.requestMatchers("/public/**").permitAll()
                        .requestMatchers("/secure/admin/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/secure/**").hasAnyAuthority(roleService.findAllRoleNameList())
                        .anyRequest().denyAll())
//				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .cors(cors -> cors.configurationSource(request -> corsRequestFilter()))
                .requiresChannel(channel -> channel
                        .requestMatchers(new RequestHeaderRequestMatcher("X-Forwarded-Proto", "http")).requiresSecure()
                )
                .build();
    }

    private void headersFilter(HeadersConfigurer<HttpSecurity> header) {

        header.contentTypeOptions(withDefaults())
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                .xssProtection(HeadersConfigurer.XXssConfig::disable)
                .contentSecurityPolicy(csp -> {
                    String cspPolicy = "default-src 'self'; script-src 'self' 'strict-dynamic' " +
                            (scriptInlineAllowed ? "'unsafe-inline'; " : ";") +
                            "style-src 'self' " + (scriptInlineAllowed ? "'unsafe-inline'; " : ";") +
                            " img-src 'self' data:; object-src 'none'; " +
                            "base-uri 'self'; frame-ancestors 'self'; form-action 'self';" +
                            "report-uri /csp-violation-report-endpoint;";
                    if (cspReportOnly) {
                        csp.policyDirectives(cspPolicy).reportOnly();
                    } else {
                        csp.policyDirectives(cspPolicy);
                    }
                })
                .httpStrictTransportSecurity(hsts -> {
                    if (hstsEnabled) {
                        hsts.maxAgeInSeconds(31536000).includeSubDomains(true).preload(true);
                    } else {
                        hsts.disable();
                    }
                })
                .addHeaderWriter(new StaticHeadersWriter("Cross-Origin-Opener-Policy", "same-origin"))
                .permissionsPolicyHeader(permissions -> permissions.policy("geolocation=(), microphone=(), camera=(), fullscreen=(self), vibrate=()"));

    }

    private CorsConfiguration corsRequestFilter() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(applicationDomain);
        config.setAllowedMethods(allowedMethod);
//        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "appName", "Cache-Control"));
        config.addAllowedHeader("*");
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true); // Set to false if credentials are not needed
        config.setMaxAge(3600L);
        return config;
    }


//    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.setAllowedOrigins(applicationDomain); // Adjust for your domain
//        config.addAllowedHeader("*");
//        config.addAllowedMethod("*");
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }

    @Bean
    public CorsConfigurationSource corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = corsRequestFilter();
        source.registerCorsConfiguration("/**", config);
//        return new CorsFilter(source);
        return  source;
    }

//    @Bean
//    AuthenticationManager customAuthenticationManager(UserDetailsService userDetailsService, PasswordEncoder encoder) {
//
//        return authentication -> {
//            String username = authentication.getPrincipal() + "";
//            String password = authentication.getCredentials() + "";
//
//            UserDetails user = userDetailsService.loadUserByUsername(username);
//
//            if (!encoder.matches(password, user.getPassword())) {
//                throw new BadCredentialsException("Bad credentials.");
//
//            }
//            if (!user.isEnabled()) {
//                throw new DisabledException("User account is not active.");
//            }
//
//            return new UsernamePasswordAuthenticationToken(username, null, user.getAuthorities());
//        };
//    }

}
