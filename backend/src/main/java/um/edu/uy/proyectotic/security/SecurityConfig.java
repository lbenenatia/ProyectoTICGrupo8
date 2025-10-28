package um.edu.uy.proyectotic.security;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  private final ApiKeyFilter apiKeyFilter;     // ya lo tenés
  private final JwtAuthFilter jwtAuthFilter;   // tu filtro JWT

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable());

    http.authorizeHttpRequests(auth -> auth
      // Externos con API Key
      .requestMatchers("/api/ext/**").authenticated()

      // Público (login/registro, swagger si querés)
      .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()

      // Admin
      .requestMatchers("/api/admin/**").hasRole("ADMIN")

      // Resto de la app (clientes logueados)
      .requestMatchers("/api/**").authenticated()

      // Static, health, etc.
      .anyRequest().permitAll()
    );

    // Orden de filtros: API Key solo mira /api/ext/**; JWT para el resto
    http.addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class);
    http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
