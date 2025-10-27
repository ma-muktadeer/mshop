package com.ithouse.mshop.core.security;

import com.ithouse.core.security.permission.PermissionChecker;
import com.ithouse.mshop.core.entity.AppPermission;
import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AppPermissionChecker implements PermissionChecker {
    @Autowired
    private UserService userService;

    @Override
    public boolean hasPermission(String[] permissions, boolean allRequired) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal user)) {
            return false;
        }
        Long userId = user.getId();
        List<String> permissionNameList = userService.findPermissionByUserId(userId);
        return allRequired ? hasAllPermission(permissionNameList, permissions) : hasAnyPermission(permissionNameList, permissions);
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
