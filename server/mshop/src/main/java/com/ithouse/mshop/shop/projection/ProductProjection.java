package com.ithouse.mshop.shop.projection;

import com.ithouse.mshop.shop.entity.Category;
import com.ithouse.mshop.shop.utils.ProductSellBy;

import java.util.Date;
import java.util.List;

public interface ProductProjection {
    Long getProductId();
    int getIsActive();
    String getProductName();
    String getProductDescription();
    ProductSellBy getProductSellBy();
    Date getCreateDate();
    List<Category> getProductCategories();
}
