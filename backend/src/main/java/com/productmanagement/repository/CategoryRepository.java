package com.productmanagement.repository;

import com.productmanagement.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL")
    List<Category> findRootCategories();
    
    List<Category> findByParent(Category parent);
    
    @Query("SELECT c FROM Category c WHERE c.path LIKE :pathPattern")
    List<Category> findByPathStartingWith(String pathPattern);

    List<Category> findByParentIdIsNull();
} 