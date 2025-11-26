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
public class UserOrdersController {

    private final OrderService orderService;


    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getMyOrders(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<PurchaseOrder> orders = orderService.getOrdersByUser(userEmail);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<PurchaseOrder> getMyOrder(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();
            PurchaseOrder order = orderService.getOrderById(orderId);
            
            if (!order.getUser().getEmail().equals(userEmail)) {
                return ResponseEntity.status(403).build(); 
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}