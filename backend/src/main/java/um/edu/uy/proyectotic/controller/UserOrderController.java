package um.edu.uy.proyectotic.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.PurchaseOrder;
import um.edu.uy.proyectotic.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class UserOrderController {

    private final OrderService orderService;

    /**
     * Obtiene los pedidos del usuario autenticado
     */
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getMyOrders(Authentication authentication) {
        try {
            // Obtiene el email del usuario autenticado
            String userEmail = authentication.getName();
            List<PurchaseOrder> orders = orderService.getOrdersByUserEmail(userEmail);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene un pedido específico del usuario autenticado
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<PurchaseOrder> getMyOrder(
            @PathVariable String orderId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            PurchaseOrder order = orderService.getOrderById(orderId);
            
            // Verifica que el pedido pertenezca al usuario
            if (!order.getUser().getEmail().equals(userEmail)) {
                return ResponseEntity.status(403).build(); // Forbidden
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}