package um.edu.uy.proyectotic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.uy.proyectotic.model.CreationProduct;
import um.edu.uy.proyectotic.model.CreationProductId;

public interface CreationProductRepository extends JpaRepository<CreationProduct, CreationProductId> { }
