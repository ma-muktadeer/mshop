package com.ithouse.mshop.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_regex")
public class Regex {
    @Column(name = "id_regex_key") @Id Long regexId;
    @Column(name = "tx_name") String regexType;
    @Column(name = "tx_regex") String regex;

    public Long getRegexId() {
        return regexId;
    }

    public void setRegexId(Long regexId) {
        this.regexId = regexId;
    }

    public String getRegexType() {
        return regexType;
    }

    public void setRegexType(String regexType) {
        this.regexType = regexType;
    }

    public String getRegex() {
        return regex;
    }

    public void setRegex(String regex) {
        this.regex = regex;
    }
}
