package com.ithouse.mshop.shop.repo;

import com.ithouse.mshop.shop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Long> {
}
