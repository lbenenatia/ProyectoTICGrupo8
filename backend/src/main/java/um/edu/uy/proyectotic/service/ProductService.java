package um.edu.uy.proyectotic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.uy.proyectotic.dto.ProductDto;
import um.edu.uy.proyectotic.model.Product;
import um.edu.uy.proyectotic.model.ProductCategory;
import um.edu.uy.proyectotic.model.enums.CreationType;
import um.edu.uy.proyectotic.repository.ProductCategoryRepository;
import um.edu.uy.proyectotic.repository.ProductRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product save(Product p) {
        return productRepository.save(p);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public Map<String, List<ProductDto>> getProductsByCreationType(CreationType creationType) {
        try {
            System.out.println("=== DEBUG ProductService START ===");
            System.out.println("Looking for creation type: " + creationType);
            
            List<ProductCategory> specificCategories = productCategoryRepository.findAllByApplicableTypeOrderByOrderAsc(creationType);
            System.out.println("Specific categories found: " + specificCategories.size());
            specificCategories.forEach(cat -> System.out.println(" - " + cat.getName() + " (order: " + cat.getOrder() + ")"));

            List<ProductCategory> sharedCategories = productCategoryRepository.findAllByApplicableTypeOrderByOrderAsc(CreationType.BOTH);
            System.out.println("Shared categories found: " + sharedCategories.size());
            sharedCategories.forEach(cat -> System.out.println(" - " + cat.getName() + " (order: " + cat.getOrder() + ")"));

            System.out.println("BOTH categories names:");
            sharedCategories.forEach(cat -> {
                System.out.println(" - " + cat.getName() + " (id: " + cat.getId() + ")");
                System.out.println("   Products count: " + cat.getProducts().size());
                System.out.println("   Available products: " + 
                    cat.getProducts().stream().filter(Product::isAvailable).count());
            });

            List<ProductCategory> allCategories = new ArrayList<>(specificCategories);
            allCategories.addAll(sharedCategories);

            allCategories.sort((a, b) -> {
                if (a.getOrder() == null) return 1;
                if (b.getOrder() == null) return -1;
                return a.getOrder().compareTo(b.getOrder());
            });

            Map<String, List<ProductDto>> result = new LinkedHashMap<>();
            
            for (ProductCategory category : allCategories) {
                String categoryName = category.getName();
                System.out.println("Processing category: " + categoryName);
                
                if (result.containsKey(categoryName)) {
                    System.out.println("WARNING: Skipping duplicate category: " + categoryName);
                    continue;
                }
                
                List<ProductDto> products = category.getProducts().stream()
                    .filter(Product::isAvailable)
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
                    
                result.put(categoryName, products);
            }
            
            System.out.println("=== DEBUG ProductService END ===");
            System.out.println("Final result categories: " + result.keySet());
            System.out.println("Final result size: " + result.size());
            return result;
            
        } catch (Exception e) {
            System.err.println("ERROR in getProductsByCreationType: " + e.getMessage());
            e.printStackTrace();
            return new LinkedHashMap<>();
        }
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