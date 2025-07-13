package com.ithouse.mshop.shop.repo;

import com.ithouse.mshop.shop.entity.Product;
import com.ithouse.mshop.shop.projection.ProductProjection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long> {

    List<ProductProjection> findAllByIsActive(int isActive);
    List<ProductProjection> findAllByUsers_UserIdAndIsActive(Long userId, int active);
}
