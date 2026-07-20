package com.example.ecpms.auth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
    private JwtAuthFilter jwtAuthFilter;

	 @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

	        http
	            .csrf(csrf -> csrf.disable())
	            .authorizeHttpRequests(auth -> auth

	            	    // Public APIs
	            	    .requestMatchers("/auth/login", "/auth/register")
	            	    .permitAll()

	            	    // Admin Only
	            	    .requestMatchers("/auth/change-password")
	            	    .hasAnyRole("ADMIN","MANAGER","EMPLOYEE")

	            	    // Example Admin APIs
	            	    .requestMatchers("/admin/**")
	            	    .hasRole("ADMIN")

	            	    // Everything else requires login
	            	    .anyRequest()
	            	    .authenticated()
	            	);

	        // Add JWT filter
	        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

	        return http.build();
	    }
	 
	 
	 @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }

}
