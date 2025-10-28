package um.edu.uy.proyectotic.model;

import jakarta.persistence.*;
import lombok.*;
import um.edu.uy.proyectotic.model.enums.CreationType;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "creation")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Creation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "creation_id")
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private CreationType type;

  @Column(nullable = false, length = 20)
  private String size;

  @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
  private BigDecimal basePrice = BigDecimal.ZERO;

  @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
  private BigDecimal totalPrice = BigDecimal.ZERO;

  @OneToMany(mappedBy = "creation", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private Set<CreationProduct> items = new HashSet<>();
}
