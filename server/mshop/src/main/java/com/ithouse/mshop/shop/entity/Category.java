package com.ithouse.mshop.shop.entity;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "T_CATEGORY")
public class Category {
    @Id
    @Column(name = "ID_CATEGORY_KEY")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(name = "IS_ACTIVE")
    private int isActive = 1;

    @Column(name = "TX_CATEGORY_NAME",length = 50, nullable = false)
    private String categoryName;

    @Column(name = "DT_CREATE", nullable = false, updatable = false)
    private Date createDate = new Date();


    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sub_category_key")
    private List<SubCategory> productSubCategories;

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public int getIsActive() {
        return isActive;
    }

    public void setIsActive(int isActive) {
        this.isActive = isActive;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }


    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }


    public List<SubCategory> getProductSubCategories() {
        return productSubCategories;
    }

    public void setProductSubCategories(List<SubCategory> productSubCategories) {
        this.productSubCategories = productSubCategories;
    }
}


