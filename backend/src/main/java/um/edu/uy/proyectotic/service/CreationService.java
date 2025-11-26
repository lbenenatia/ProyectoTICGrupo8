package um.edu.uy.proyectotic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.uy.proyectotic.model.*;
import um.edu.uy.proyectotic.model.enums.CreationType;
import um.edu.uy.proyectotic.repository.*;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreationService {

    private final CreationRepository creationRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CreationProductRepository creationProductRepository;


    private BigDecimal calculateBasePrice(CreationType type, String sizeRaw) {
        if (sizeRaw == null) sizeRaw = "";
        String size = sizeRaw.toLowerCase();

        if (type == CreationType.PIZZA) {
            BigDecimal base = new BigDecimal("12"); // precio base pizza
            BigDecimal multiplier = switch (size) {
                case "small"  -> new BigDecimal("1.0");
                case "medium" -> new BigDecimal("1.5");
                case "large"  -> new BigDecimal("2.0");
                default       -> BigDecimal.ONE;
            };
            return base.multiply(multiplier);
        }

        if (type == CreationType.BURGER) {
            BigDecimal base = new BigDecimal("9"); // precio base burger
            BigDecimal multiplier = switch (size) {
                case "single" -> new BigDecimal("1.0");
                case "double" -> new BigDecimal("1.5555");
                case "triple" -> new BigDecimal("2.0");
                default       -> BigDecimal.ONE;
            };
            return base.multiply(multiplier);
        }

        return BigDecimal.ZERO;
    }


    @Transactional
    public Creation createCreation(Long orderId, CreationType type, String size, List<Long> productIds) {

        PurchaseOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));


        BigDecimal basePrice = calculateBasePrice(type, size);

        // Crear creación con precio base
        Creation creation = Creation.builder()
                .order(order)
                .type(type)
                .size(size)
                .basePrice(basePrice)
                .totalPrice(BigDecimal.ZERO)
                .build();

        creation = creationRepository.save(creation);

        // 2) SUMAR PRECIO DE INGREDIENTES
        BigDecimal extras = BigDecimal.ZERO;

        for (Long productId : productIds) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productId));

            CreationProduct cp = CreationProduct.builder()
                    .id(new CreationProductId(creation.getId(), product.getId()))
                    .creation(creation)
                    .product(product)
                    .quantity(1)
                    .build();

            creationProductRepository.save(cp);

            extras = extras.add(product.getPrice());
        }

        // 3) total = basePrice + extras
        BigDecimal total = basePrice.add(extras);

        creation.setTotalPrice(total);
        creationRepository.save(creation);

        // 4) Actualizar total del pedido
        order.setTotal(order.getTotal().add(total));
        orderRepository.save(order);

        return creation;
    }

}
