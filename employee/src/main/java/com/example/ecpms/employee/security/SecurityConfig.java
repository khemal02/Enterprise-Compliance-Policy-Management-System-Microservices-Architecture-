package com.example.ecpms.employee.security;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

                        // GET Employees
                        .requestMatchers(HttpMethod.GET,"/employee/**")
                        .hasAnyRole("ADMIN","MANAGER")

                        // Create Employee
                        .requestMatchers(HttpMethod.POST,"/employee/**")
                        .hasRole("ADMIN")

                        // Update Employee
                        .requestMatchers(HttpMethod.PUT,"/employee/**")
                        .hasRole("ADMIN")

                        // Delete Employee
                        .requestMatchers(HttpMethod.DELETE,"/employee/**")
                        .hasRole("ADMIN")

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
