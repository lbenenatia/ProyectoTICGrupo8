package um.edu.uy.proyectotic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import um.edu.uy.proyectotic.model.Product;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByAvailableTrue();
    List<Product> findAllByCategoryId(Long categoryId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category")
    List<Product> findAllWithCategory();
    
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE p.category.id = :categoryId")
    List<Product> findAllByCategoryIdWithCategory(@Param("categoryId") Long categoryId);

}
