package um.edu.uy.proyectotic.model;

import jakarta.persistence.*;
import lombok.*;
import um.edu.uy.proyectotic.model.enums.CreationType;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_category")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductCategory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_category")
  private Long id;

  @Column(nullable = false, length = 50)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "applicable_type", nullable = false, length = 10)
  private CreationType applicableType;

  @Column(nullable = false)
  private boolean mandatory = false;

  @Column(name = "`order`")
  private Integer order;

  @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = false)
  @Builder.Default
  private List<Product> products = new ArrayList<>();
}
