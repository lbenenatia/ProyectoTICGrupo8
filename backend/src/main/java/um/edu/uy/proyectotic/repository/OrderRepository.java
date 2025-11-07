package um.edu.uy.proyectotic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.uy.proyectotic.model.PurchaseOrder;
import um.edu.uy.proyectotic.model.User;

import java.util.List;

public interface OrderRepository extends JpaRepository<PurchaseOrder, Long> {
  List<PurchaseOrder> findAllByUser(User user);
}
