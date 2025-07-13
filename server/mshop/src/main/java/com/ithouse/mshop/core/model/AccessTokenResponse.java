package com.ithouse.mshop.core.model;

import java.util.Date;

public class AccessTokenResponse extends BaseResponse {
	String accessToken;
	Date expireOn;

	public AccessTokenResponse(String status, String msg) {
		super(status, msg);
	}

	public AccessTokenResponse(String accessToken, Date expireOn, String status, String msg) {
		super(status, msg);
		this.accessToken = accessToken;
		this.expireOn = expireOn;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public Date getExpireOn() {
		return expireOn;
	}

	public void setExpireOn(Date expireOn) {
		this.expireOn = expireOn;
	}
}
