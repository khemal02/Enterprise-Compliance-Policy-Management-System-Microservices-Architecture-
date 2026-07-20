package com.example.ecpms.auth.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.example.ecpms.auth.repository.UserRepository;
import com.example.ecpms.auth.model.User;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
	
	 @Autowired
	    private JwtUtil jwtUtil;

	    @Autowired
	    private UserRepository userRepository;
	    
	    @Override
	    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {

	        String path = request.getServletPath();

	        return path.equals("/auth/login") || path.equals("/auth/register");
	    }


	    @Override
	    protected void doFilterInternal(@NonNull HttpServletRequest request,
							    		@NonNull HttpServletResponse response,
							    		@NonNull FilterChain filterChain)
	            throws ServletException, IOException {

	        final String authHeader = request.getHeader("Authorization");

	        String token = null;
	        String username = null;

	        // Extract token
	        try {

	            if (authHeader != null && authHeader.startsWith("Bearer ")) {

	                token = authHeader.substring(7);
	                username = jwtUtil.extractUsername(token);
	            }

	        } catch (Exception e) {
	            filterChain.doFilter(request, response);
	            return;
	        }

	        // Validate and set authentication
	        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

	            User user = userRepository.findByUsername(username).orElse(null);

	            if (user != null && jwtUtil.validateToken(token)) {

	            	List<SimpleGrantedAuthority> authorities = List.of(
	            	        new SimpleGrantedAuthority("ROLE_" + user.getRole())
	            	);

	            	UsernamePasswordAuthenticationToken authToken =
	            	        new UsernamePasswordAuthenticationToken(
	            	                username,
	            	                null,
	            	                authorities
	            	        );

	                authToken.setDetails(
	                        new WebAuthenticationDetailsSource().buildDetails(request)
	                );

	                SecurityContextHolder.getContext().setAuthentication(authToken);
	            }
	        }

	        filterChain.doFilter(request, response);
	    }

}
