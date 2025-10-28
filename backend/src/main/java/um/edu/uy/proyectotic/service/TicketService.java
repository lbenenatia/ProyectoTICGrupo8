package um.edu.uy.proyectotic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.uy.proyectotic.model.*;
import um.edu.uy.proyectotic.model.enums.OrderStatus;
import um.edu.uy.proyectotic.model.enums.PaymentMethod;
import um.edu.uy.proyectotic.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;

    @Transactional
    public Ticket generateTicket(Long orderId, PaymentMethod paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (order.getTicket() != null)
            throw new RuntimeException("Este pedido ya tiene un ticket");

        BigDecimal subtotal = order.getTotal();
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.18)); // IVA 18%
        BigDecimal total = subtotal.add(tax);

        Ticket ticket = Ticket.builder()
                .id("TCK-" + UUID.randomUUID().toString().substring(0, 8))
                .order(order)
                .emissionDate(LocalDate.now())
                .subtotal(subtotal)
                .tax(tax)
                .total(total)
                .paymentMethod(paymentMethod)
                .build();

        order.setStatus(OrderStatus.PAGADO);
        orderRepository.save(order);

        return ticketRepository.save(ticket);
    }
}
