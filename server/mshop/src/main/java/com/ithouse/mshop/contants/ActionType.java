package com.ithouse.mshop.contants;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum ActionType {
    UNDEFINED("UNDEFINED"),//DO NOT USE THIS IN ANY ACTION
    ACTION_LOGIN("LOGIN"),
    ACTION_SELECT("SELECT"),
    ACTION_REGISTER("REGISTER"),
    ACTION_LOGOUT("LOGOUT"),
    LOAD_DETAILS("LOAD_DETAILS"),
    BUILD_IMAGE("BUILD_IMAGE"),
    UPDATE("UPDATE"),
    SELECT_ALL_BY_USER("SELECT_ALL_BY_USER"),
    ACTION_SELECT_ALL("SELECT_ALL"),
    ACTION_NEW("NEW"),
    ACTION_SAVE("SAVE"),
    SELECT_PERMISSION_ROLE("SELECT_PERMISSION_ROLE"),
    MANAGE_APP_PERMISSION("MANAGE_APP_PERMISSION"),
    LOAD_PERMISSION("LOAD_PERMISSION"),
    ACTION_DELETE("DELETE"),
    APPROVE("APPROVE");

    private final String actionType;

    private ActionType(String at) {
        this.actionType = at;
    }

    @Override
    public String toString() {
        return actionType;
    }

    private static final Map<String, ActionType> LOOKUP = Arrays.stream(ActionType.values())
            .collect(Collectors.toMap(m -> m.actionType, Function.identity()));

    public static ActionType lookup(String at) {
        return LOOKUP.getOrDefault(at, ActionType.UNDEFINED);
    }
}
