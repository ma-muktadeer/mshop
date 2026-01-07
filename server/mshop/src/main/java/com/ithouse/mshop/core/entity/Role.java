package com.ithouse.mshop.core.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "T_ROLE")
public class Role extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROLE_SEQ_GEN") // for oracle
    // @SequenceGenerator(sequenceName = "ROLE_SEQ", allocationSize = 1, name = "ROLE_SEQ_GEN") // for oracle
    @Column(name = "id_role_key")
    private Long roleId;

    @Column(name = "TX_ROLE_NAME", nullable = false, unique = true,  length = 50)
    private String roleName;

    @Column(name = "TX_DISPLAY_NAME",  nullable = false, unique = true, length = 50)
    private String displayName;

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

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
