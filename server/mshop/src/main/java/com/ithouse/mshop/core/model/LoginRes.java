package com.ithouse.mshop.core.model;

import java.util.Date;

import com.ihouse.core.message.interfaces.Message;
import com.ithouse.mshop.core.entity.User;

public class LoginRes {
    
    private User user;
    private String token;
    private boolean authenticated;
    private Date issuedAt;
    private Date expireAt;
    private Message<?> res;
    
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public boolean isAuthenticated() {
        return authenticated;
    }
    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }
    public Date getIssuedAt() {
        return issuedAt;
    }
    public void setIssuedAt(Date issuedAt) {
        this.issuedAt = issuedAt;
    }
    public Date getExpireAt() {
        return expireAt;
    }
    public void setExpireAt(Date expireAt) {
        this.expireAt = expireAt;
    }
    public Message<?> getRes() {
        return res;
    }
    public void setRes(Message<?> res) {
        this.res = res;
    }


}
