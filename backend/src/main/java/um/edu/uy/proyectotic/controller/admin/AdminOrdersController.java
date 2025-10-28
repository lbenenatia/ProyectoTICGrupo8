package um.edu.uy.proyectotic.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.Order;
import um.edu.uy.proyectotic.model.enums.OrderStatus;
import um.edu.uy.proyectotic.repository.OrderRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class AdminOrdersController {

  private final OrderRepository orderRepo;

  @GetMapping
  public ResponseEntity<List<Order>> listAll(@RequestParam(required = false) OrderStatus status) {
    if (status == null) return ResponseEntity.ok(orderRepo.findAll());
    return ResponseEntity.ok(orderRepo.findAll().stream().filter(o -> o.getStatus()==status).toList());
  }

  @PutMapping("/{orderId}/status")
  public ResponseEntity<Order> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
    Order o = orderRepo.findById(orderId).orElseThrow();
    o.setStatus(status);
    return ResponseEntity.ok(orderRepo.save(o));
  }
}
