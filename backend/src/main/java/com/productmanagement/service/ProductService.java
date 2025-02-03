package com.productmanagement.service;

import com.productmanagement.dto.ProductDTO;
import com.productmanagement.exception.ResourceNotFoundException;
import com.productmanagement.mapper.ProductMapper;
import com.productmanagement.model.Category;
import com.productmanagement.model.Product;
import com.productmanagement.repository.ProductRepository;
import com.productmanagement.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    
    @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        return productMapper.toDTO(productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id)));
    }
    
    @Transactional(readOnly = true)
    public Page<ProductDTO> findByFilters(String name, BigDecimal minPrice, 
                                     BigDecimal maxPrice, Boolean available, 
                                     Pageable pageable) {
        Page<Product> products = productRepository.findByFilters(name, minPrice, maxPrice, available, pageable);
        return products.map(productMapper::toDTO);
    }
    
    @Transactional
    public ProductDTO create(ProductDTO productDTO) {
        Category category = null;
        if (productDTO.getCategoryId() != null) {
            category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategoryId()));
        }

        Product product = productMapper.toEntity(productDTO);
        product.setCategory(category);
        
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Product price must be greater than zero");
        }

        product = productRepository.save(product);
        return productMapper.toDTO(product);
    }
    
    @Transactional
    public ProductDTO update(Long id, ProductDTO productDTO) {
        Product product = findProductEntity(id);
        updateProductFromDTO(product, productDTO);
        return productMapper.toDTO(productRepository.save(product));
    }
    
    @Transactional
    public void delete(Long id) {
        Product product = findProductEntity(id);
        productRepository.delete(product);
    }
    
    private void updateProductFromDTO(Product product, ProductDTO dto) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setAvailable(dto.isAvailable());
        
        Category category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
        product.setCategory(category);
    }

    public Page<ProductDTO> findAll(Pageable pageable) {
        return productRepository.findAll(pageable).map(productMapper::toDTO);
    }

    private Product findProductEntity(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
} 