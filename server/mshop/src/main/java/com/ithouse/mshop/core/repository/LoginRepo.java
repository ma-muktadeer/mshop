package com.ithouse.mshop.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ithouse.mshop.core.entity.Login;

public interface LoginRepo extends JpaRepository<Login, Long>{
    
}
