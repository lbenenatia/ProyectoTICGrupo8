package um.edu.uy.proyectotic.model;

import jakarta.persistence.*;
import lombok.*;
import um.edu.uy.proyectotic.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_order")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrder {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_id")
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "creation_date", nullable = false)
  private LocalDateTime creationDate = LocalDateTime.now();

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private OrderStatus status = OrderStatus.CREADO;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal total = BigDecimal.ZERO;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<Creation> creations = new ArrayList<>();

  @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
  private Ticket ticket;
}
