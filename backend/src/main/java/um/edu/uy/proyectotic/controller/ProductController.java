package um.edu.uy.proyectotic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.dto.ProductDto;
import um.edu.uy.proyectotic.model.ProductCategory;
import um.edu.uy.proyectotic.model.Product;
import um.edu.uy.proyectotic.model.enums.CreationType;
import um.edu.uy.proyectotic.service.ProductService;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // para que el front pueda llamar
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.findAll();
    }

    @GetMapping("/by-type/{type}")
    public Map<String, List<ProductDto>> getByCreationType(@PathVariable String type) {
        System.out.println("============ CONTROLLER REACHED ============");
        System.out.println("Received request for type: " + type);
        try {
            CreationType creationType = CreationType.valueOf(type.toUpperCase());
            System.out.println("Parsed CreationType: " + creationType);
            Map<String, List<ProductDto>> result = productService.getProductsByCreationType(creationType);
            System.out.println("Returning " + result.size() + " categories");
            return result;
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid creation type: " + type);
            throw new RuntimeException("Invalid creation type: " + type + ". Valid values are: PIZZA, BURGER");
        } catch (Exception e) {
            System.err.println("Error getting products by type: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error getting products: " + e.getMessage());
        }
    }

    @PostMapping
    public Product create(
        @RequestParam String name,
        @RequestParam BigDecimal price,
        @RequestParam Long categoryId
    ) {
        ProductCategory category = new ProductCategory();
        category.setId(categoryId);
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setCategory(category);
        return productService.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}
