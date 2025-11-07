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
        // Get categories specific to this type
        List<ProductCategory> specificCategories = productCategoryRepository.findAllByApplicableTypeOrderByOrderAsc(creationType);

        // Get categories that are BOTH (shared between pizza and burger)
        List<ProductCategory> sharedCategories = productCategoryRepository.findAllByApplicableTypeOrderByOrderAsc(CreationType.BOTH);

        // Combine both lists
        List<ProductCategory> allCategories = new ArrayList<>(specificCategories);
        allCategories.addAll(sharedCategories);

        // Sort by order
        allCategories.sort((a, b) -> {
            if (a.getOrder() == null) return 1;
            if (b.getOrder() == null) return -1;
            return a.getOrder().compareTo(b.getOrder());
        });

        return allCategories.stream()
            .collect(Collectors.toMap(
                ProductCategory::getName,
                category -> category.getProducts().stream()
                    .filter(Product::isAvailable)
                    .map(this::convertToDto)
                    .collect(Collectors.toList())
            ));
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
