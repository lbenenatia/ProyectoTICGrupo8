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

    @Transactional
    public Creation createCreation(Long orderId, CreationType type, String size, List<Long> productIds) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Creation creation = Creation.builder()
                .order(order)
                .type(type)
                .size(size)
                .basePrice(BigDecimal.ZERO)
                .totalPrice(BigDecimal.ZERO)
                .build();

        creation = creationRepository.save(creation);

        BigDecimal total = BigDecimal.ZERO;

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
            total = total.add(product.getPrice());
        }

        creation.setTotalPrice(total);
        creationRepository.save(creation);

        // Actualiza el total del pedido
        order.setTotal(order.getTotal().add(total));
        orderRepository.save(order);

        return creation;
    }
}
