package um.edu.uy.proyectotic.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.PurchaseOrder;
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
  public ResponseEntity<List<PurchaseOrder>> listAll(@RequestParam(required = false) OrderStatus status) {
    if (status == null) return ResponseEntity.ok(orderRepo.findAll());
    return ResponseEntity.ok(orderRepo.findAll().stream().filter(o -> o.getStatus()==status).toList());
  }

  @PutMapping("/{orderId}/status")
  public ResponseEntity<PurchaseOrder> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
    PurchaseOrder o = orderRepo.findById(orderId).orElseThrow();
    o.setStatus(status);
    return ResponseEntity.ok(orderRepo.save(o));
  }
  @PutMapping("/{orderId}/advance")
  public ResponseEntity<PurchaseOrder> advanceStatus(@PathVariable Long orderId) {

      PurchaseOrder o = orderRepo.findById(orderId)
              .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

      switch (o.getStatus()) {
          case QUEUE -> o.setStatus(OrderStatus.PREPARING);
          case PREPARING -> o.setStatus(OrderStatus.DELIVERING);
          case DELIVERING -> o.setStatus(OrderStatus.RECEIVED);
          default -> throw new RuntimeException("Este pedido ya no puede avanzar.");
      }

      return ResponseEntity.ok(orderRepo.save(o));
  }


}
