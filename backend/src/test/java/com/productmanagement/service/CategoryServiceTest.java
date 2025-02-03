package com.productmanagement.service;

import com.productmanagement.dto.CategoryDTO;
import com.productmanagement.model.Category;
import com.productmanagement.repository.CategoryRepository;
import com.productmanagement.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category parentCategory;
    private CategoryDTO categoryDTO;

    @BeforeEach
    void setUp() {
        parentCategory = Category.builder()
            .id(1L)
            .name("Electronics")
            .path("Electronics")
            .build();

        categoryDTO = CategoryDTO.builder()
            .name("Smartphones")
            .parentId(1L)
            .build();
    }

    @Test
    void shouldCreateCategory() {
        CategoryDTO categoryDTO = CategoryDTO.builder()
            .name("Electronics")
            .build();
        
        Category category = Category.builder()
            .name("Electronics")
            .build();
        
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        CategoryDTO result = categoryService.create(categoryDTO);

        assertNotNull(result);
        assertEquals(categoryDTO.getName(), result.getName());
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void shouldGetAllRootCategories() {
        when(categoryRepository.findRootCategories()).thenReturn(List.of(parentCategory));

        List<CategoryDTO> rootCategories = categoryService.getAllRootCategories();

        assertNotNull(rootCategories);
        assertEquals(1, rootCategories.size());
    }

    @Test
    void shouldGetCategoryById() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(parentCategory));

        CategoryDTO found = categoryService.findById(1L);

        assertNotNull(found);
        assertEquals(parentCategory.getId(), found.getId());
    }

    @Test
    void shouldThrowExceptionWhenCategoryNotFound() {
        Long categoryId = 1L;
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
            categoryService.findById(categoryId)
        );
    }

    @Test
    void shouldUpdateCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(parentCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(parentCategory);

        CategoryDTO updated = categoryService.update(1L, categoryDTO);

        assertNotNull(updated);
        assertEquals(categoryDTO.getName(), updated.getName());
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void shouldDeleteCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(parentCategory));
        when(categoryRepository.findByParent(parentCategory)).thenReturn(List.of());
        doNothing().when(categoryRepository).delete(parentCategory);

        categoryService.delete(1L);

        verify(categoryRepository).delete(parentCategory);
    }
} 