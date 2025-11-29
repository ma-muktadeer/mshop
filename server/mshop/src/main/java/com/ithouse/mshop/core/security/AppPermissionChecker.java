package com.ithouse.mshop.core.security;

import com.ithouse.core.security.permission.PermissionChecker;
import com.ithouse.mshop.core.entity.AppPermission;
import com.ithouse.mshop.core.principal.UserPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class AppPermissionChecker implements PermissionChecker {
    @Value("${permission.ignore.for:ithousebd,ithouse}")
    private Set<String> ignoreFor;

    @Override
    public boolean hasPermission(String[] permissions, boolean allRequired) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal user)) {
            return false;
        }

        if (ignoreFor.contains(user.getLoginName())) {
            return true;
        }
        List<String> permissionList = user.getPermissions().stream().map(AppPermission::getPermissionName).toList();
        return allRequired ? hasAllPermission(permissionList, permissions) : hasAnyPermission(permissionList, permissions);
    }


    private boolean hasAnyPermission(List<String> permissionNameList, String[] permissions) {
        for (String permission : permissions) {
            if (permissionNameList.contains(permission)) {
                return true;
            }
        }
        return false;
    }

    private boolean hasAllPermission(List<String> permissionNameList, String[] permissions) {
        for (String permission : permissions) {
            if (!permissionNameList.contains(permission)) {
                return false;
            }
        }
        return true;
    }

}
