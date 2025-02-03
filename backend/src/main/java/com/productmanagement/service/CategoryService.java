package com.productmanagement.service;

import com.productmanagement.dto.CategoryDTO;
import com.productmanagement.model.Category;
import com.productmanagement.repository.CategoryRepository;
import com.productmanagement.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryDTO create(CategoryDTO dto) {
        Category category = toEntity(dto);
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParent(parent);
            category.setPath(parent.getPath() + " > " + category.getName());
        } else {
            category.setPath(category.getName());
        }
        return toDTO(categoryRepository.save(category));
    }

    public List<CategoryDTO> getAllRootCategories() {
        return categoryRepository.findRootCategories().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public CategoryDTO findById(Long id) {
        return categoryRepository.findById(id)
            .map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(dto.getName());
        return toDTO(categoryRepository.save(category));
    }

    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        List<Category> children = categoryRepository.findByParent(category);
        if (!children.isEmpty()) {
            throw new IllegalStateException("Cannot delete category with children");
        }
        categoryRepository.delete(category);
    }

    public List<Category> findAllRootCategories() {
        return categoryRepository.findByParentIdIsNull();
    }

    public List<CategoryDTO> findSubcategories(Long id) {
        Category parent = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return categoryRepository.findByParent(parent).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public Category getCategoryEntity(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(category -> CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .path(category.getPath())
                .build())
            .collect(Collectors.toList());
    }

    private CategoryDTO toDTO(Category category) {
        return CategoryDTO.builder()
            .id(category.getId())
            .name(category.getName())
            .parentId(category.getParent() != null ? category.getParent().getId() : null)
            .path(category.getPath())
            .build();
    }

    private Category toEntity(CategoryDTO dto) {
        return Category.builder()
            .name(dto.getName())
            .build();
    }
} 