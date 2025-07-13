package com.ithouse.mshop.contants;

public enum ActionType {
   
    ACTION_LOGIN("LOGIN"),
    ACTION_SELECT("SELECT"),
    ACTION_REGISTER("REGISTER"), 
    ACTION_LOGOUT("LOGOUT"), 
    LOAD_DETAILS("LOAD_DETAILS"),
    BUILD_IMAGE("BUILD_IMAGE"),
    UPDATE("UPDATE"),
    SELECT_ALL_BY_USER("SELECT_ALL_BY_USER"),
    ACTION_SELECT_ALL("SELECT_ALL");

    private final String actionType;

    private ActionType(String at){
        this.actionType = at;
    }

    @Override
    public String toString(){
        return actionType;
    }

}
