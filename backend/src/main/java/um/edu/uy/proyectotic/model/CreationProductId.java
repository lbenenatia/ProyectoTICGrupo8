package um.edu.uy.proyectotic.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class CreationProductId implements Serializable {
  private Long creationId;
  private Long productId;
}
