package com.ithouse.mshop.shop.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "T_SUB_CATEGORY")
public class SubCategory {

    @Id
    @Column(name = "ID_SUB_CATEGORY_KEY")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subCategoryId;

    @Column(name = "IS_ACTIVE")
    private int isActive = 1;

    @Column(name = "DT_CREATE", nullable = false, updatable = false)
    private Date createDate = new Date();


    @Column(name = "TX_SUB_CATEGORY_NAME",length = 50, nullable = false)
    private String subCategoryName;

    public Long getSubCategoryId() {
        return subCategoryId;
    }

    public void setSubCategoryId(Long subCategoryId) {
        this.subCategoryId = subCategoryId;
    }

    public int getIsActive() {
        return isActive;
    }

    public void setIsActive(int isActive) {
        this.isActive = isActive;
    }

    public String getSubCategoryName() {
        return subCategoryName;
    }

    public void setSubCategoryName(String subCategoryName) {
        this.subCategoryName = subCategoryName;
    }


    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }


}
