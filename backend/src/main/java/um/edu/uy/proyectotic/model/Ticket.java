package um.edu.uy.proyectotic.model;

import jakarta.persistence.*;
import lombok.*;
import um.edu.uy.proyectotic.model.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ticket")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ticket {

  @Id
  @Column(name = "id_ticket", length = 64)
  private String id;

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_id", nullable = false, unique = true)
  private Order order;

  @Column(name = "emission_date", nullable = false)
  private LocalDate emissionDate = LocalDate.now();

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal subtotal;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal tax;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal total;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method", nullable = false, length = 20)
  private PaymentMethod paymentMethod;
}
