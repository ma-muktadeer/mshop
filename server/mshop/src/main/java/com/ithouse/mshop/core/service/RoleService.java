package com.ithouse.mshop.core.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.ithouse.core.message.AbstractMessageHeader;
import com.ithouse.core.message.ResponseBuilder;
import com.ithouse.core.message.interfaces.Message;
import com.ithouse.core.message.services.ItHouseService;
import com.ithouse.mshop.contants.ActionType;
import com.ithouse.mshop.core.entity.GenericMap;
import com.ithouse.mshop.core.repository.GenericMapRepo;
import org.apache.coyote.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.repository.RoleRepo;

@Service
public class RoleService extends ItHouseService<List<Role>> {
	private static final Logger log = LoggerFactory.getLogger(RoleService.class);

    @Autowired
    private RoleRepo roleRepo;

	@Autowired
	private GenericMapRepo gm;
    public List<Role> getAllByIsActive() {
       return roleRepo.findAllByActive(1);
    }

	@SuppressWarnings({ "unchecked" })
	public Message<?> itHouseService(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			var res = switch (ActionType.lookup(actionType)) {
				case ACTION_SELECT -> select(requestMessage, actionType);
				default -> {
					log.error("Unknown Action Type: " + actionType);
					throw new Exception("Invalid Action ");
				}
			};
			msgResponse = ResponseBuilder.buildResponse(header, res);

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponse(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;

		}

	private List<Role> select(Message<List<Role>> requestMessage, String actionType) {
		return roleRepo.findAllByActive(1);
	}

	@SuppressWarnings("null")
    public List<Role> saveRole(Set<Role> role){
       return roleRepo.saveAll(role);
    }

	public Set<Role> findRoleByRoleName(String roleName) {
		Optional<Set<Role>> roles = roleRepo.findByRoleName(roleName);
        return roles.orElseGet(() -> Set.of(new Role()));

    }

	public String[] findAllRoleNameList() {
        return getAllByIsActive().stream()
                .map(Role::getRoleName).toArray(String[]::new);
	}

	public List<Role> getPermissionRole(long permissionId){
		return roleRepo.getPermissionList(permissionId);
	}

	public List<Role> selectUnassignRoleList(List<Role> assignRoleList) {
		if(null == assignRoleList || assignRoleList.isEmpty()) {
			return roleRepo.findAll();
		}
		Set<Long> toIdList = assignRoleList.parallelStream().mapToLong(Role::getRoleId).boxed()
				.collect(Collectors.toSet());

		return roleRepo.findByRoleIdsNotIn(toIdList);
	}

	public List<Role> selectAssignedRole(Long fromId, String fromName) {
		List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(fromId, fromName, "ROLE", 1);
		if (!mapList.isEmpty()) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(GenericMap::getToId).boxed()
					.collect(Collectors.toSet());
			return roleRepo.findByRoleIds(toIdList);
		}
		return Collections.emptyList();
	}
	
	public Optional<Set<Role>> findByRoleName(String roleName) {
		return roleRepo.findByRoleName(roleName);
	}


}
