package um.edu.uy.proyectotic.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "creation_product")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreationProduct {

  @EmbeddedId
  private CreationProductId id;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("creationId")
  @JoinColumn(name = "creation_id")
  private Creation creation;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("productId")
  @JoinColumn(name = "product_id")
  private Product product;

  @Column(nullable = false)
  private Integer quantity = 1;
}
