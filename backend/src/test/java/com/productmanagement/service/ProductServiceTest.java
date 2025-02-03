package com.productmanagement.service;

import com.productmanagement.mapper.ProductMapper;
import com.productmanagement.model.Product;
import com.productmanagement.model.Category;
import com.productmanagement.repository.ProductRepository;
import com.productmanagement.repository.CategoryRepository;
import com.productmanagement.exception.ResourceNotFoundException;
import com.productmanagement.dto.ProductDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private Category category;
    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        category = Category.builder()
            .id(1L)
            .name("Electronics")
            .path("Electronics")
            .build();

        product = Product.builder()
            .id(1L)
            .name("Smartphone")
            .price(new BigDecimal("999.99"))
            .category(category)
            .available(true)
            .build();

        productDTO = ProductDTO.builder()
            .id(1L)
            .name("Smartphone")
            .price(new BigDecimal("999.99"))
            .categoryId(1L)
            .build();
    }

    @Test
    void shouldCreateProduct() {
        ProductDTO inputDTO = ProductDTO.builder()
            .name("Smartphone")
            .price(new BigDecimal("999.99"))
            .categoryId(1L)
            .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.toDTO(any(Product.class))).thenReturn(productDTO);
        when(productMapper.toEntity(any(ProductDTO.class))).thenReturn(product);

        ProductDTO result = productService.create(inputDTO);

        assertNotNull(result);
        assertEquals(inputDTO.getName(), result.getName());
        assertEquals(inputDTO.getPrice(), result.getPrice());
        assertEquals(inputDTO.getCategoryId(), result.getCategoryId());
    }

    @Test
    void shouldUpdateProduct() {
        ProductDTO updateDTO = ProductDTO.builder()
            .name("Updated Product")
            .price(BigDecimal.valueOf(200))
            .categoryId(1L)
            .build();

        Product updatedProduct = Product.builder()
            .id(1L)
            .name("Updated Product")
            .price(BigDecimal.valueOf(200))
            .category(category)
            .available(true)
            .build();

        ProductDTO updatedDTO = ProductDTO.builder()
            .id(1L)
            .name("Updated Product")
            .price(BigDecimal.valueOf(200))
            .categoryId(1L)
            .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);
        when(productMapper.toDTO(any(Product.class))).thenReturn(updatedDTO);

        ProductDTO updated = productService.update(1L, updateDTO);

        assertNotNull(updated);
        assertEquals(updateDTO.getName(), updated.getName());
        assertEquals(updateDTO.getPrice(), updated.getPrice());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonExistentProduct() {
        ProductDTO updateDTO = ProductDTO.builder()
            .name("Updated Product")
            .price(BigDecimal.valueOf(200))
            .categoryId(1L)
            .build();

        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.update(1L, updateDTO);
        });
    }

    @Test
    void shouldDeleteProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        doNothing().when(productRepository).delete(product);

        productService.delete(1L);

        verify(productRepository).delete(product);
    }

    @Test
    void shouldFindProductById() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        ProductDTO found = productService.findById(1L);

        assertNotNull(found);
        assertEquals(product.getId(), found.getId());
    }

    @Test
    void shouldFindAllProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(List.of(product));
        
        when(productRepository.findAll(any(Pageable.class))).thenReturn(productPage);
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        Page<ProductDTO> result = productService.findAll(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(productRepository).findAll(pageable);
    }

    @Test
    void shouldFindProductsByFilter() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(List.of(product));
        
        when(productRepository.findByFilters(any(), any(), any(), any(), any(Pageable.class)))
            .thenReturn(productPage);
        when(productMapper.toDTO(any(Product.class))).thenReturn(productDTO);

        Page<ProductDTO> result = productService.findByFilters(null, null, null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void shouldThrowExceptionWhenProductNotFound() {
        Long productId = 1L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
            productService.findById(productId)
        );
    }
} 