package com.ithouse.mshop.core.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.repository.RoleRepo;

@Service
public class RoleService {

    @Autowired
    private RoleRepo roleRepo;

    public List<Role> getAllByIsActive() {
       return roleRepo.findAllByActive(1);
    }

    @SuppressWarnings("null")
    public List<Role> saveRole(Set<Role> role){
       return roleRepo.saveAll(role);
    }

	public Set<Role> findRoleByRoleName(String roleName) {
		Optional<Set<Role>> roles = roleRepo.findByRoleName(roleName);
		if(roles.isEmpty()) {
			return Set.of(new Role());
		}
		
		return roles.get();
	}

	public String[] findAllRoleNameList() {
		
		List<String> roles = getAllByIsActive().stream()
	            .map(Role::getRoleName)
	            .collect(Collectors.toList());
	        return roles.toArray(new String[0]);
	}
    
}
