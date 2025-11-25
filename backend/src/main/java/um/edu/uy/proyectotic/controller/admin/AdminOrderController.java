package um.edu.uy.proyectotic.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.PurchaseOrder;
import um.edu.uy.proyectotic.model.enums.OrderStatus;
import um.edu.uy.proyectotic.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
@PreAuthorize("hasRole('ADMIN')") // Requiere que el usuario sea admin
public class AdminOrderController {

    private final OrderService orderService;

    /**
     * Obtiene TODOS los pedidos del sistema (para administradores)
     */
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllOrders() {
        try {
            List<PurchaseOrder> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Actualiza el estado de un pedido
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<PurchaseOrder> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status
    ) {
        try {
            PurchaseOrder updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene un pedido específico por ID
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<PurchaseOrder> getOrderById(@PathVariable String orderId) {
        try {
            PurchaseOrder order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}