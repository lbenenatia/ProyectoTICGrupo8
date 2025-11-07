package um.edu.uy.proyectotic.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

// @Component - Removed to prevent auto-registration, will be manually added to security chain
public class ApiKeyFilter extends OncePerRequestFilter {

  @Value("${api.keys.dgi:}")
  private String dgiApiKey;
  
  @Value("${api.keys.bps:}")
  private String bpsApiKey;
  
  @Value("${api.keys.payments:}")
  private String paymentsApiKey;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {

    String path = request.getRequestURI();

    // Solo protegemos /api/ext/**
    if (path.startsWith("/api/ext/")) {
      String headerKey = request.getHeader("X-API-Key");

      if (headerKey == null || !isValidKey(path, headerKey)) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"error\":\"Invalid or missing API Key\"}");
        return;
      }
    }

    filterChain.doFilter(request, response);
  }

  private boolean isValidKey(String path, String key) {
    if (path.contains("/dgi/")) return key.equals(dgiApiKey);
    if (path.contains("/bps/")) return key.equals(bpsApiKey);
    if (path.contains("/payments/")) return key.equals(paymentsApiKey);
    return false;
  }
}
