package um.edu.uy.proyectotic.dto;

import um.edu.uy.proyectotic.model.enums.PaymentMethod;
import um.edu.uy.proyectotic.model.Ticket;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TicketResponse(
    String id,
    LocalDate emissionDate,
    BigDecimal total,
    PaymentMethod paymentMethod
) {
    public static TicketResponse fromEntity(Ticket t) {
        return new TicketResponse(
            t.getId(),
            t.getEmissionDate(),
            t.getTotal(),
            t.getPaymentMethod()
        );
    }
}
