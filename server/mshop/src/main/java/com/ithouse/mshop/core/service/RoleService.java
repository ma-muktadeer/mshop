package com.ithouse.mshop.core.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.ithouse.mshop.core.entity.GenericMap;
import com.ithouse.mshop.core.repository.GenericMapRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.repository.RoleRepo;

@Service
public class RoleService {

    @Autowired
    private RoleRepo roleRepo;

	@Autowired
	private GenericMapRepo gm;
    public List<Role> getAllByIsActive() {
       return roleRepo.findAllByActive(1);
    }

    @SuppressWarnings("null")
    public List<Role> saveRole(Set<Role> role){
       return roleRepo.saveAll(role);
    }

	public Set<Role> findRoleByRoleName(String roleName) {
		Optional<Set<Role>> roles = roleRepo.findByRoleName(roleName);
        return roles.orElseGet(() -> Set.of(new Role()));

    }

	public String[] findAllRoleNameList() {

        return getAllByIsActive().stream()
                .map(Role::getRoleName).toArray(String[]::new);
	}

	public List<Role> getPermissionRole(long permissionId){
		return roleRepo.getPermissionList(permissionId);
	}


	public List<Role> selectUnassignRoleList(List<Role> assignRoleList) {
		if(null == assignRoleList || assignRoleList.isEmpty()) {
			return roleRepo.findAll();
		}
		Set<Long> toIdList = assignRoleList.parallelStream().mapToLong(Role::getRoleId).boxed()
				.collect(Collectors.toSet());

		return roleRepo.findByRoleIdsNotIn(toIdList);
	}


	public List<Role> selectAssignedRole(Long fromId, String fromName) {
		List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(fromId, fromName, "ROLE", 1);
		if (!mapList.isEmpty()) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(GenericMap::getToId).boxed()
					.collect(Collectors.toSet());
			return roleRepo.findByRoleIds(toIdList);
		}
		return Collections.emptyList();
	}
	
	public Optional<Set<Role>> findByRoleName(String roleName) {
		return roleRepo.findByRoleName(roleName);
	}
}
