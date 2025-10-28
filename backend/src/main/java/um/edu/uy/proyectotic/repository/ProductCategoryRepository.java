package um.edu.uy.proyectotic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.uy.proyectotic.model.ProductCategory;
import um.edu.uy.proyectotic.model.enums.CreationType;

import java.util.List;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    List<ProductCategory> findAllByApplicableTypeOrderByOrderAsc(CreationType type);
}
