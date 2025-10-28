package um.edu.uy.proyectotic.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.*;
import um.edu.uy.proyectotic.model.enums.*;
import um.edu.uy.proyectotic.service.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class OrderController {

    private final OrderService orderService;
    private final CreationService creationService;
    private final TicketService ticketService;

    @PostMapping("/create/{userEmail}")
    public ResponseEntity<Order> createOrder(@PathVariable String userEmail) {
        return ResponseEntity.ok(orderService.createOrder(userEmail));
    }

    @PostMapping("/{orderId}/add-creation")
    public ResponseEntity<Creation> addCreation(
            @PathVariable Long orderId,
            @RequestParam CreationType type,
            @RequestParam String size,
            @RequestBody List<Long> productIds
    ) {
        return ResponseEntity.ok(creationService.createCreation(orderId, type, size, productIds));
    }

    @PostMapping("/{orderId}/generate-ticket")
    public ResponseEntity<Ticket> generateTicket(
            @PathVariable Long orderId,
            @RequestParam PaymentMethod method
    ) {
        return ResponseEntity.ok(ticketService.generateTicket(orderId, method));
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userEmail) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userEmail));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
}
