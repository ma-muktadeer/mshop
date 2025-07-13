package com.ithouse.mshop.core.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ithouse.mshop.core.entity.Role;

public interface RoleRepo extends JpaRepository<Role, Long>{
    
    List<Role> findAllByActive(int i);

	Optional<Set<Role>> findByRoleName(String roleName);
    
    

    
}
