package com.ithouse.mshop.core.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ithouse.mshop.core.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

    User findByloginName(String loginName);

    Optional<User> findAllByLoginNameOrEmailAndActive(String loginName, String email, int i);

	Optional<User> findAllByLoginNameOrEmailAndAppNameAndActive(String username, String username2, String appName, int i);

	Page<User> findAllByActive(int i, Pageable pageable);

	User findAllByUserIdAndAppNameAndActive(Long userId, String appName, int i);

    User findAllByUserIdAndActive(Long userId, int i);

    // Optional<User> findAllByEmail(String username);

    
    
} 
