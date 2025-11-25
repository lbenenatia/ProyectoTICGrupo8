package um.edu.uy.proyectotic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.uy.proyectotic.model.PurchaseOrder;
import um.edu.uy.proyectotic.model.User;
import um.edu.uy.proyectotic.model.enums.OrderStatus;
import um.edu.uy.proyectotic.repository.OrderRepository;
import um.edu.uy.proyectotic.repository.UserRepository;

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
                .status(OrderStatus.QUEUE)     
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

    @Transactional
    public PurchaseOrder cancelOrder(Long orderId) {
        PurchaseOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (order.getStatus() != OrderStatus.QUEUE) {
            throw new RuntimeException("El pedido no se puede cancelar en este estado");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    public List<PurchaseOrder> getLastFiveOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pageable limit = PageRequest.of(0, 5);

        return orderRepository.findLastFiveByUser(user, limit);
    }
    
}
