package um.edu.uy.proyectotic.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductDto {
    private Long id;
    private String name;
    private BigDecimal price;
    private boolean available;
    private Long categoryId;
    private String categoryName;
}
