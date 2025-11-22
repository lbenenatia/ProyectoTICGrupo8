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
import java.util.HashMap;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
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
            throw new RuntimeException("Invalid creation type: " + type + ". Valid values are: PIZZA, BURGER, BOTH");
        } catch (Exception e) {
            System.err.println("Error getting products by type: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error getting products: " + e.getMessage());
        }
    }

    // NUEVO ENDPOINT: Ingredientes (incluye toppings)
    @GetMapping("/ingredients/{type}")
    public Map<String, List<ProductDto>> getIngredients(@PathVariable String type) {
        System.out.println("============ INGREDIENTS ENDPOINT ============");
        System.out.println("Received request for ingredients type: " + type);
        
        try {
            CreationType creationType = CreationType.valueOf(type.toUpperCase());
            Map<String, List<ProductDto>> result = new HashMap<>();
            
            // Obtener ingredientes específicos del tipo (PIZZA o BURGER)
            Map<String, List<ProductDto>> specificIngredients = productService.getProductsByCreationType(creationType);
            result.putAll(specificIngredients);
            
            // Agregar toppings (categoría BOTH llamada "Toppings")
            Map<String, List<ProductDto>> bothProducts = productService.getProductsByCreationType(CreationType.BOTH);
            if (bothProducts.containsKey("Toppings")) {
                result.put("toppings", bothProducts.get("Toppings"));
            }
            
            System.out.println("Returning ingredients: " + result.keySet());
            return result;
            
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid type: " + type + ". Valid values: PIZZA, BURGER");
        } catch (Exception e) {
            System.err.println("Error getting ingredients: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error getting ingredients: " + e.getMessage());
        }
    }

    // NUEVO ENDPOINT: Extras (según tipo)
    @GetMapping("/extras/{type}")
    public Map<String, List<ProductDto>> getExtras(@PathVariable String type) {
        System.out.println("============ EXTRAS ENDPOINT ============");
        System.out.println("Received request for extras type: " + type);
        
        try {
            CreationType creationType = CreationType.valueOf(type.toUpperCase());
            Map<String, List<ProductDto>> result = new HashMap<>();
            
            // Obtener todos los productos BOTH
            Map<String, List<ProductDto>> bothProducts = productService.getProductsByCreationType(CreationType.BOTH);
            
            // Filtrar según el tipo de producto
            if (creationType == CreationType.PIZZA) {
                // Para PIZZA: solo bebida
                if (bothProducts.containsKey("Bebida")) {
                    result.put("bebida", bothProducts.get("Bebida"));
                }
            } else if (creationType == CreationType.BURGER) {
                // Para BURGER: bebida y acompañamiento
                if (bothProducts.containsKey("Bebida")) {
                    result.put("bebida", bothProducts.get("Bebida"));
                }
                if (bothProducts.containsKey("Acompañamiento")) {
                    result.put("acompañamiento", bothProducts.get("Acompañamiento"));
                }
            }
            
            System.out.println("Returning extras: " + result.keySet());
            return result;
            
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid type: " + type + ". Valid values: PIZZA, BURGER");
        } catch (Exception e) {
            System.err.println("Error getting extras: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error getting extras: " + e.getMessage());
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