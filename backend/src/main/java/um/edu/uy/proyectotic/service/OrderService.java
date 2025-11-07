package um.edu.uy.proyectotic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.uy.proyectotic.model.*;
import um.edu.uy.proyectotic.model.enums.OrderStatus;
import um.edu.uy.proyectotic.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public PurchaseOrder createOrder(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PurchaseOrder order = PurchaseOrder.builder()
                .user(user)
                .creationDate(LocalDateTime.now())
                .status(OrderStatus.CREADO)
                .total(BigDecimal.ZERO)
                .build();

        return orderRepository.save(order);
    }

    public List<PurchaseOrder> getOrdersByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return orderRepository.findAllByUser(user);
    }

    public PurchaseOrder getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }
}
