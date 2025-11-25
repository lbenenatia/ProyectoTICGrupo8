package um.edu.uy.proyectotic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import um.edu.uy.proyectotic.model.PurchaseOrder;
import um.edu.uy.proyectotic.model.User;

import java.util.List;

public interface OrderRepository extends JpaRepository<PurchaseOrder, Long> {

    List<PurchaseOrder> findAllByUser(User user);

    @Query("SELECT o FROM PurchaseOrder o WHERE o.user = :user ORDER BY o.creationDate DESC")
    List<PurchaseOrder> findLastFiveByUser(@Param("user") User user, Pageable pageable);
}
