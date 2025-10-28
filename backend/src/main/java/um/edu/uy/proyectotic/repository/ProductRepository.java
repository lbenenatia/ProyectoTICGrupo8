package um.edu.uy.proyectotic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.uy.proyectotic.model.Product;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByAvailableTrue();
    List<Product> findAllByCategoryId(Long categoryId);
}
