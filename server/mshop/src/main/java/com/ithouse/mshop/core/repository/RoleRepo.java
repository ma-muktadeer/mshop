package com.ithouse.mshop.core.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ithouse.mshop.core.entity.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoleRepo extends JpaRepository<Role, Long>{
    
    List<Role> findAllByActive(int i);

	Optional<Set<Role>> findByRoleName(String roleName);

    @Query("SELECT T FROM Role T WHERE T.roleId not in :roleIdList and active = 1")
    List<Role> findByRoleIdsNotIn(@Param("roleIdList")Set<Long> roleIdList);

    @Query("SELECT T FROM Role T WHERE T.roleId in :roleIdList and active = 1")
    List<Role> findByRoleIds(@Param("roleIdList")Set<Long> roleIdList);

    @Query(value="""
            select r.* from t_role r 
            join T_GENERIC_MAP m on m.tx_to_type_name = 'ROLE' 
            and m.lng_to_id = r.id_role_key and r.is_active = 1
            join t_app_permission p on m.tx_from_type_name = 'APP_PERMISSION'
            and m.lng_from_id = p.id_permission_key and p.is_active = 1
            where p.id_permission_key = :permissionId 
            and m.is_active = 1
            and r.is_active = 1
            and p.is_active = 1
            and m.tx_status in ('APPROVED', 'PEND_DEASSINED')
            """, nativeQuery = true)
    List<Role> getPermissionList(@Param("permissionId") Long permissionId);

}
