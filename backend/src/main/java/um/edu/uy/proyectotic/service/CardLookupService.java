package um.edu.uy.proyectotic.service;

import org.springframework.stereotype.Service;
import um.edu.uy.proyectotic.dto.CardOwnerResponse;

@Service
public class CardLookupService {

  public CardOwnerResponse lookup(String cardNumber) {
    String sanitized = cardNumber.replaceAll("\\s|-", "");
    if (!isLuhnValid(sanitized)) {
      throw new IllegalArgumentException("Invalid card number");
    }

    // Demo: En la vida real, se consulta a un PSP o vault/tokenizador.
    String network = detectNetwork(sanitized);
    String masked = maskPan(sanitized);

    // Estos datos vendrían del PSP/banco o de un vault propio
    // (Nunca persistir PAN en claro).
    String holder = "APELLIDO, NOMBRE";
    String doc = "4.567.890-1";
    String address = "Av. Ejemplo 1234, Montevideo";

    return new CardOwnerResponse(network, holder, doc, address, masked);
  }

  private boolean isLuhnValid(String pan) {
    int sum = 0; boolean alt = false;
    for (int i = pan.length() - 1; i >= 0; i--) {
      int n = pan.charAt(i) - '0';
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 == 0;
  }

  private String detectNetwork(String pan) {
    if (pan.startsWith("4")) return "VISA";
    if (pan.matches("^5[1-5].*")) return "MASTERCARD";
    if (pan.matches("^3[47].*")) return "AMEX";
    return "UNKNOWN";
  }

  private String maskPan(String pan) {
    if (pan.length() < 10) return "****";
    return pan.substring(0,4) + "********" + pan.substring(pan.length()-4);
  }
}
