package com.ithouse.mshop.core.entity;

import com.ithouse.mshop.core.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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

    // @ManyToMany(mappedBy = "roles")
    // private List<User> users;



    // public Role() {
    // }

    // public Role(Long roleId, String roleName) {
    //     this.roleId = roleId;
    //     this.roleName = roleName;
    // }

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

    // public List<User> getUsers() {
    //     return users;
    // }

    // public void setUsers(List<User> users) {
    //     this.users = users;
    // }

}
