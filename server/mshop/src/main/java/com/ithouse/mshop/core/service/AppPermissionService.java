package com.ithouse.mshop.core.service;


import com.ithouse.core.message.AbstractMessageHeader;
import com.ithouse.core.message.ResponseBuilder;
import com.ithouse.core.message.interfaces.Message;
import com.ithouse.core.message.services.ItHouseService;
import com.ithouse.mshop.contants.ActionType;
import com.ithouse.mshop.core.entity.AppPermission;
import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.repository.AppPermissionRepo;
import com.ithouse.mshop.core.utils.AppUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class AppPermissionService extends ItHouseService<List<AppPermission>> {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    AppPermissionRepo permissionRepo;

    @Autowired
    SharedGenericMapService sharedGenericMapService;

    @Autowired
    RoleService roleService;

    private static final String APP_PERMISSION = "APP_PERMISSION";
    private static final String ROLE = "ROLE";
//    @Autowired
//    private UserService userService;


    @SuppressWarnings({"unchecked"})
    public Message<?> itHouseService(Message requestMessage) throws Exception {

        AbstractMessageHeader header = null;
        Message<?> msgResponse = null;

        try {
            header = requestMessage.getHeader();
            String actionType = header.getActionType();

            if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
                List<AppPermission> objList = select(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
                List<AppPermission> objList = insert(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
                AppPermission objList = save(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else if (actionType.equals(ActionType.UPDATE.toString())) {
                List<AppPermission> objList = update(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else if (actionType.equals(ActionType.SELECT_PERMISSION_ROLE.toString())) {
                AppPermission objList = selectPermissionRole(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else if (actionType.equals(ActionType.MANAGE_APP_PERMISSION.toString())) {
                AppPermission objList = managePermissionRole(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else if (actionType.equals(ActionType.LOAD_PERMISSION.toString())) {
                List<AppPermission> objList = loadPermission(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
                List<AppPermission> objList = delete(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else if (actionType.equals(ActionType.APPROVE.toString())) {
                AppPermission objList = approve(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, objList);
            } else {
                log.info("No action handle [{}]", actionType);
            }

        } catch (Exception ex) {

            msgResponse = ResponseBuilder.buildErrorResponse(header, ex);

            log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
        }

        return msgResponse;
    }


    private AppPermission approve(Message<List<AppPermission>> message, String action) {
        AppPermission ap = message.getPayload().get(0);
        AppPermission db = permissionRepo.findById(ap.getPermissionId()).get();


        return permissionRepo.save(db);
    }

    private AppPermission save(Message<List<AppPermission>> message, String action) {
        AppPermission st = message.getPayload().get(0);


        AppPermission db = permissionRepo.findById(st.getPermissionId()).get();
        db.setDisplayName(st.getDisplayName());
        db.setDesc(st.getDesc());
        return permissionRepo.save(db);
    }

    private AppPermission selectPermissionRole(Message<List<AppPermission>> message, String action) {
        AppPermission st = message.getPayload().get(0);

        List<Role> roleList = roleService.selectAssignedRole(st.getPermissionId(), APP_PERMISSION);
        st.setRoleList(roleList);

        List<Role> unassignRoleList = roleService.selectUnassignRoleList(roleList);
        st.setUnassignRoleList(unassignRoleList);
        return st;
    }

    private AppPermission managePermissionRole(Message<List<AppPermission>> message, String action) {
        AppPermission rg = message.getPayload().get(0);
        List<Role> roleList = rg.getRoleList();

        sharedGenericMapService.unMapAndMap(rg.getPermissionId(), roleList.stream().mapToLong(Role::getRoleId).boxed().collect(Collectors.toList()), APP_PERMISSION, ROLE, message.getHeader().getUserId());

        return rg;
    }


    private List<AppPermission> loadPermission(Message<List<AppPermission>> message, String action) {
        AppPermission pref = message.getPayload().get(0);
        List<AppPermission> permissions = permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));

        for (AppPermission p : permissions) {
            p.setRoleList(roleService.getPermissionRole(p.getPermissionId()));
        }
        return permissions;
    }

    private List<AppPermission> delete(Message<List<AppPermission>> message, String action) {
        AppPermission pref = message.getPayload().getFirst();
        pref.setActive(0);
        permissionRepo.save(pref);
        return AppUtils.toList(permissionRepo.findAll());
    }

    private List<AppPermission> select(Message<List<AppPermission>> message, String action) throws Exception {
        AppPermission pref = message.getPayload().getFirst();
        return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
    }

    private List<AppPermission> insert(Message<List<AppPermission>> message, String action) throws Exception {
        AppPermission pref = message.getPayload().getFirst();
        permissionRepo.save(pref);
        return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
    }

    private void insert(AppPermission pref, String action) throws Exception {
        permissionRepo.save(pref);
    }

    public List<AppPermission> insert(List<AppPermission> AppPermissionList, String action) throws Exception {
        AppPermissionList.parallelStream().forEach(map -> {
            try {
                insert(map, action);
            } catch (Exception e) {
                log.error("Error executing action/id [{}]", action);
            }
        });
        return AppUtils.toList(permissionRepo.findAll());
    }


    private List<AppPermission> update(Message<List<AppPermission>> message, String action) throws Exception {
        AppPermission pref = message.getPayload().getFirst();
        permissionRepo.save(pref);
        return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
    }

    public AppPermission mapRoleToPermission(long permissionId, long roleId, long userId) {

//		User user = userService.findUserById(userId);
        log.info("Adding role to permission [{}]:[{}]", permissionId, roleId);
        sharedGenericMapService.mapNew(permissionId, roleId, APP_PERMISSION, ROLE, userId);
        return permissionRepo.findById(permissionId).get();
    }

    public AppPermission mapRoleToPermission(long permissionId, String roleId, long userId) {
//		User user = userService.findUserById(userId);

        log.info("Adding role to permission [{}]:[{}]", permissionId, roleId);
        List<Long> ids = Arrays.stream(roleId.split(",")).map(Long::valueOf).collect(Collectors.toList());
        sharedGenericMapService.mapNew(permissionId, ids, APP_PERMISSION, ROLE, userId);
        return permissionRepo.findById(permissionId).get();
    }

    public AppPermission mapRoleToPermission(String permissionName, String roleName, long userId) {
        AppPermission p = permissionRepo.findByPermissionName(permissionName);
        Optional<Set<Role>> sr = roleService.findByRoleName(roleName);
        if (sr.isPresent()) {
            Role r = sr.get().stream().findFirst().get();
            return mapRoleToPermission(p.getPermissionId(), r.getRoleId(), userId);
        } else {
            log.info("permission not found [{}]", permissionName);
        }
        return null;
    }


    private List<AppPermission> findPermissionByRoleIds(List<Long> roleIds) {
        return permissionRepo.findByRoleIds(roleIds);
    }
}
