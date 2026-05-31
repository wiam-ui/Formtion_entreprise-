package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Autoriser les requêtes de pré-vérification CORS (Preflight)
                        .requestMatchers(org.springframework.web.cors.CorsUtils::isPreFlightRequest)
                        .permitAll()

                        // Routes publiques d'authentification
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/users/me").authenticated()

                        // ==========================================
                        // 1. SESSIONS & FORMATIONS MANAGEMENT
                        // ==========================================
                        // Seuls les RH peuvent modifier (POST, PUT, DELETE) les formations et sessions
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/formations/**", "/api/sessions/**").hasRole("HR")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/formations/**", "/api/sessions/**").hasRole("HR")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/formations/**", "/api/sessions/**").hasRole("HR")

                        // Tous les utilisateurs authentifiés peuvent voir (GET) les formations et sessions
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/formations/**", "/api/sessions/**").authenticated()

                        // ==========================================
                        // 2. EMPLOYEES MANAGEMENT
                        // ==========================================
                        // Gestion complète des employés réservée exclusivement aux RH
                        .requestMatchers("/api/employees/**").hasRole("HR")

                        // ==========================================
                        // 3. INSCRIPTIONS MANAGEMENT (Ordre corrigé)
                        // ==========================================
                        // Un employé connecté peut demander une inscription (POST global)
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/inscriptions").authenticated()

                        // Un employé connecté peut consulter son propre historique d'inscriptions
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/inscriptions/employee/**").authenticated()

                        // TOUTES les autres routes d'inscriptions (GET global des RH, PUT progression, DELETE)
                        // sont restreintes strictement au rôle HR
                        .requestMatchers("/api/inscriptions/**").hasRole("HR")

                        // Sécurité par défaut pour toute autre route non listée
                        .anyRequest().authenticated())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(
                                    jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Unauthorized: Please login");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(
                                    jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter()
                                    .write("Forbidden: You don't have permission");
                        }))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://localhost:3000"));

        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(List.of(
                "Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With", "Cookie"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}