package com.productmanagement.controller;

import com.productmanagement.dto.ProductDTO;
import com.productmanagement.model.Product;
import com.productmanagement.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.productmanagement.service.ProductService;
import com.productmanagement.exception.ResourceNotFoundException;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.springframework.context.annotation.Import;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        reset(productService);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateProduct() throws Exception {
        ProductDTO productDTO = ProductDTO.builder()
            .name("Smartphone")
            .price(new BigDecimal("999.99"))
            .categoryId(1L)
            .build();

        when(productService.create(any(ProductDTO.class))).thenReturn(productDTO);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(productDTO.getName()))
                .andExpect(jsonPath("$.price").value(productDTO.getPrice().doubleValue()));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldGetProductById() throws Exception {
        ProductDTO productDTO = ProductDTO.builder()
            .id(1L)
            .name("Test Product")
            .description("Test Description")
            .price(BigDecimal.valueOf(100))
            .available(true)
            .build();

        when(productService.findById(1L)).thenReturn(productDTO);

        mockMvc.perform(get("/api/products/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Test Product")))
                .andExpect(jsonPath("$.price", is(100)));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturnNotFoundForInvalidId() throws Exception {
        when(productService.findById(999L))
            .thenThrow(new ResourceNotFoundException("Product not found"));

        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldNotAllowUserToCreateProduct() throws Exception {
        ProductDTO productDTO = ProductDTO.builder()
            .name("Test Product")
            .price(BigDecimal.valueOf(100))
            .categoryId(1L)
            .description("Test Description")
            .available(true)
            .build();

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productDTO)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Access Denied"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturnNotFoundWhenProductDoesNotExist() throws Exception {
        Long productId = 1L;
        when(productService.findById(productId))
            .thenThrow(new ResourceNotFoundException("Product not found"));

        mockMvc.perform(get("/api/products/" + productId))
                .andExpect(status().isNotFound());
    }
} 