package com.ithouse.mshop.core.model;

import java.io.Serializable;
import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;

/**
 * BaseEntity
 */
@SuppressWarnings("serial")
@MappedSuperclass
public class BaseEntity implements Serializable{


	@Column(name = "is_active")
	protected Integer active = 1;
	
	@Column(name = "id_user_mod_key")
	protected Long userModId;
	
	@Column(name = "id_client_key")
	protected Long clientId;
	
	@Column(name = "id_user_create_key", updatable = false)
	protected Long creatorId;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "dtt_mod", nullable = true)
	@LastModifiedDate
	protected Date modDate = new Date();
	
	
	@Column(name = "id_approve_by_key")
	protected Long approverId;
	
	@Column(name = "dtt_approve")
	protected Date approveTime;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "dtt_create" , nullable = true)
	@CreatedDate
	protected Date createDate;
	
	@Column(name = "id_state_key" , nullable = true)
	protected Integer stateId;
	
	@Column(name = "tx_state_name")
	protected String stateName;
	
	@Column(name = "id_event_key" , nullable = true)
	protected Integer eventId;
	
	
	@Transient
	protected Date toDate;


    public Integer getActive() {
        return active;
    }


    public void setActive(Integer active) {
        this.active = active;
    }


    public Long getUserModId() {
        return userModId;
    }


    public void setUserModId(Long userModId) {
        this.userModId = userModId;
    }


    public Long getClientId() {
        return clientId;
    }


    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }


    public Long getCreatorId() {
        return creatorId;
    }


    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }


    public Date getModDate() {
        return modDate;
    }


    public void setModDate(Date modDate) {
        this.modDate = modDate;
    }


    public Long getApproverId() {
        return approverId;
    }


    public void setApproverId(Long approverId) {
        this.approverId = approverId;
    }


    public Date getApproveTime() {
        return approveTime;
    }


    public void setApproveTime(Date approveTime) {
        this.approveTime = approveTime;
    }


    public Date getCreateDate() {
        return createDate;
    }


    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }


    public Integer getStateId() {
        return stateId;
    }


    public void setStateId(Integer stateId) {
        this.stateId = stateId;
    }


    public String getStateName() {
        return stateName;
    }


    public void setStateName(String stateName) {
        this.stateName = stateName;
    }


    public Integer getEventId() {
        return eventId;
    }


    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }


    public Date getToDate() {
        return toDate;
    }


    public void setToDate(Date toDate) {
        this.toDate = toDate;
    }
	
	
    
}