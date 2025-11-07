package um.edu.uy.proyectotic.controller.admin;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.dto.ProductDto;
import um.edu.uy.proyectotic.model.*;
import um.edu.uy.proyectotic.model.enums.CreationType;
import um.edu.uy.proyectotic.repository.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/catalog")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
@Transactional
public class AdminCatalogController {

  private final ProductCategoryRepository categoryRepo;
  private final ProductRepository productRepo;

  // Categories
  @PostMapping("/categories")
  public ResponseEntity<ProductCategory> createCategory(@RequestBody ProductCategory c) {
    return ResponseEntity.ok(categoryRepo.save(c));
  }

  @PutMapping("/categories/{id}")
  public ResponseEntity<ProductCategory> updateCategory(@PathVariable Long id, @RequestBody ProductCategory c) {
    ProductCategory db = categoryRepo.findById(id).orElseThrow();
    db.setName(c.getName());
    db.setApplicableType(c.getApplicableType());
    db.setMandatory(c.isMandatory());
    db.setOrder(c.getOrder());
    return ResponseEntity.ok(categoryRepo.save(db));
  }

  @DeleteMapping("/categories/{id}")
  public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
    categoryRepo.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  // Products
  @PostMapping("/products")
  public ResponseEntity<Product> createProduct(@RequestParam Long categoryId,
                                               @RequestParam String name,
                                               @RequestParam BigDecimal price,
                                               @RequestParam(defaultValue = "true") boolean available) {
    ProductCategory cat = categoryRepo.findById(categoryId).orElseThrow();
    Product p = Product.builder().name(name).price(price).available(available).category(cat).build();
    return ResponseEntity.ok(productRepo.save(p));
  }

  @PutMapping("/products/{id}")
  public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product p) {
    Product db = productRepo.findById(id).orElseThrow();
    db.setName(p.getName());
    db.setPrice(p.getPrice());
    db.setAvailable(p.isAvailable());
    if (p.getCategory() != null) db.setCategory(p.getCategory());
    return ResponseEntity.ok(productRepo.save(db));
  }

  @DeleteMapping("/products/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    productRepo.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  // Helpers para el panel
  @GetMapping("/categories")
  public ResponseEntity<List<ProductCategory>> listCategories(@RequestParam(required = false) CreationType type) {
    if (type == null) return ResponseEntity.ok(categoryRepo.findAll());
    return ResponseEntity.ok(categoryRepo.findAllByApplicableTypeOrderByOrderAsc(type));
  }

  @GetMapping("/products")
  public ResponseEntity<List<ProductDto>> listProducts(@RequestParam(required = false) Long categoryId) {
      List<Product> products;
      if (categoryId == null) {
          products = productRepo.findAllWithCategory();
      } else {
          products = productRepo.findAllByCategoryIdWithCategory(categoryId);
      }
      
      List<ProductDto> productDtos = products.stream()
          .map(this::convertToDto)
          .collect(Collectors.toList());
      
      return ResponseEntity.ok(productDtos);
  }

  private ProductDto convertToDto(Product product) {
    return ProductDto.builder()
        .id(product.getId())
        .name(product.getName())
        .price(product.getPrice())
        .available(product.isAvailable())
        .categoryId(product.getCategory().getId())
        .categoryName(product.getCategory().getName())
        .build();
  }
}
