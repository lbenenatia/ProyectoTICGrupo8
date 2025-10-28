package um.edu.uy.proyectotic.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.*;
import um.edu.uy.proyectotic.model.enums.CreationType;
import um.edu.uy.proyectotic.repository.*;

import java.util.List;

@RestController
@RequestMapping("/api/creations")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class CreationController {

    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CreationRepository creationRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategory>> getCategoriesByType(
            @RequestParam CreationType type
    ) {
        return ResponseEntity.ok(categoryRepository.findAllByApplicableTypeOrderByOrderAsc(type));
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllAvailableProducts() {
        return ResponseEntity.ok(productRepository.findAllByAvailableTrue());
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productRepository.findAllByCategoryId(categoryId));
    }

    @GetMapping("/{creationId}")
    public ResponseEntity<Creation> getCreationById(@PathVariable Long creationId) {
        return ResponseEntity.ok(creationRepository.findById(creationId)
                .orElseThrow(() -> new RuntimeException("Creacion no encontrada")));
    }
}
