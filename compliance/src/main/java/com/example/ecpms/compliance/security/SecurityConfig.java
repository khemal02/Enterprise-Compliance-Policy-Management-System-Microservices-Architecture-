package com.example.ecpms.compliance.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class SecurityConfig {
	
	private final JwtAuthFilter jwtAuthFilter;
    public SecurityConfig(JwtAuthFilter jwtAuthFilter){

        this.jwtAuthFilter = jwtAuthFilter;
     }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        http

                .csrf(csrf->csrf.disable())

                .authorizeHttpRequests(auth->auth

                		 .requestMatchers(HttpMethod.POST, "/compliance/**")
                		    .hasRole("ADMIN")

                		    .requestMatchers(HttpMethod.PUT, "/compliance/**")
                		    .hasAnyRole("ADMIN","MANAGER")

                		    .requestMatchers(HttpMethod.DELETE, "/compliance/**")
                		    .hasRole("ADMIN")

                		    .requestMatchers(HttpMethod.GET, "/compliance/**")
                		    .hasAnyRole("ADMIN","MANAGER","EMPLOYEE")

                        .anyRequest()
                        .authenticated()

                )

                .addFilterBefore(

                        jwtAuthFilter,

                        UsernamePasswordAuthenticationFilter.class

                );

        return http.build();

    }

}
