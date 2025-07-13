package com.ithouse.mshop.shop.dto;

import com.ithouse.mshop.shop.entity.Category;
import com.ithouse.mshop.shop.utils.ProductSellBy;

import java.util.Date;
import java.util.List;

public class ProductDTO {
    private Long productId;
    private int isActive ;
    private String productName;
    private String productDescription;
    private Date createDate;
    private ProductSellBy productSellBy ;
    private List<Category> productCategories;

    public ProductDTO() {}

    public ProductDTO(Long productId, int isActive, String productName,
                      String productDescription, Date createDate, ProductSellBy productSellBy,
                      List<Category> productCategories) {
        this.productId = productId;
        this.isActive = isActive;
        this.productName = productName;
        this.productDescription = productDescription;
        this.createDate = createDate;
        this.productSellBy = productSellBy;
        this.productCategories = productCategories;
    }

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

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public ProductSellBy getProductSellBy() {
        return productSellBy;
    }

    public void setProductSellBy(ProductSellBy productSellBy) {
        this.productSellBy = productSellBy;
    }

    public List<Category> getProductCategories() {
        return productCategories;
    }

    public void setProductCategories(List<Category> productCategories) {
        this.productCategories = productCategories;
    }
}
