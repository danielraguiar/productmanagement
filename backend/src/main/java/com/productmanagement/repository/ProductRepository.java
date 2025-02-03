package com.productmanagement.repository;

import com.productmanagement.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findAll(Pageable pageable);
    
    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findById(Long id);
    
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:available IS NULL OR p.available = :available)")
    Page<Product> findByFilters(
        @Param("name") String name,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("available") Boolean available,
        Pageable pageable
    );
    
    Page<Product> findByAvailable(boolean available, Pageable pageable);
} 