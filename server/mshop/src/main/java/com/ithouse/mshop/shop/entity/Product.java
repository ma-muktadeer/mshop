package com.ithouse.mshop.shop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.shop.utils.ProductSellBy;
import jakarta.persistence.*;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "T_PRODUCT")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PRODUCT_KEY")
    private Long productId;

    @Column(name = "IS_ACTIVE")
    private int isActive = 1;

    @Column(name = "TX_PRODUCT_NAME", length = 50)
    private String productName;

    @Column(name = "TX_PRODUCT_DESCRIPTION")
    private String productDescription;

    @Column(name = "DT_CREATE", nullable = false, updatable = false)
    private Date createDate = new Date();

    @Column(name = "TX_PRODUCT_SELL", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private ProductSellBy productSellBy = ProductSellBy.IN_STORE;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_category_key")
    private List<Category> productCategories;

    @Transient
    private long userId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "products_users",
            joinColumns = @JoinColumn(
                    name = "product_id", referencedColumnName = "ID_PRODUCT_KEY"),
            inverseJoinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id_user_key"))
    private Set<User> users = new HashSet<>();

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getIsActive() {
        return isActive;
    }

    public void setIsActive(int isActive) {
        this.isActive = isActive;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public ProductSellBy getProductSellBy() {
        return productSellBy;
    }


    public void setProductSellBy(ProductSellBy productSellBy) {
        this.productSellBy = productSellBy;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public List<Category> getProductCategories() {
        return productCategories;
    }

    public void setProductCategories(List<Category> productCategories) {
        this.productCategories = productCategories;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
