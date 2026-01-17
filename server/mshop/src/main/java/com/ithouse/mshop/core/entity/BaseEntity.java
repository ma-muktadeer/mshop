package com.ithouse.mshop.core.entity;

import com.ithouse.core.message.interfaces.EnablePagination;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Transient;

@MappedSuperclass
public class BaseEntity extends BaseIthouse implements EnablePagination {

    @Transient
    private Integer pageNumber;

    @Transient
    private Integer pageSize;


    @Override
    public void setPageNumber(Integer page) {
        this.pageNumber = page;
    }

    @Override
    public void setPageSize(Integer size) {
        this.pageSize = size;
    }

    @Override
    public Integer getPageNumber() {
        return this.pageNumber;
    }

    @Override
    public Integer getPageSize() {
        return this.pageSize;
    }
}
