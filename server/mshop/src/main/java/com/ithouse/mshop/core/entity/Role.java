package com.ithouse.mshop.core.entity;

import com.ithouse.mshop.core.model.BaseEntity;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "T_ROLE")
public class Role extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROLE_SEQ_GEN") // for oracle
    // @SequenceGenerator(sequenceName = "ROLE_SEQ", allocationSize = 1, name = "ROLE_SEQ_GEN") // for oracle
    @Column(name = "id_role_key")
    private Long roleId;

    @Column(name = "TX_ROLE_NAME", nullable = false, unique = true)
    private String roleName;

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

}
