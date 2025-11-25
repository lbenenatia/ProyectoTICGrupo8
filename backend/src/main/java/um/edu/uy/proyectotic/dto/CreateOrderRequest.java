package um.edu.uy.proyectotic.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateOrderRequest {
    
    private List<OrderItemDTO> items;
    private BigDecimal total;
    private String deliveryType; // "delivery" o "pickup"
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemDTO {
        private Long productId; // null si es producto custom
        private CustomProductDTO customProduct; // null si es producto normal
        private Integer quantity;
        private BigDecimal price;
        private String size;
        private List<String> ingredients;
    }
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CustomProductDTO {
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private Object customData; // Datos personalizados del producto
    }
}