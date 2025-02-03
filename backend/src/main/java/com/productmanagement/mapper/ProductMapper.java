package com.productmanagement.mapper;

import com.productmanagement.dto.ProductDTO;
import com.productmanagement.model.Category;
import com.productmanagement.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import com.productmanagement.exception.ResourceNotFoundException;
import com.productmanagement.repository.CategoryRepository;

@Mapper(componentModel = "spring")
public abstract class ProductMapper {
    
    @Autowired
    protected CategoryRepository categoryRepository;
    
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    public abstract Product toEntity(ProductDTO dto);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryPath", source = "category.path")
    @Mapping(target = "categoryName", source = "category.name")
    public abstract ProductDTO toDTO(Product entity);

    @Named("categoryIdToCategory")
    protected Category categoryIdToCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }
} 