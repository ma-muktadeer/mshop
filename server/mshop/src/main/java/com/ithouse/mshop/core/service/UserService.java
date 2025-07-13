package com.ithouse.mshop.core.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.ihouse.core.message.AbstractMessageHeader;
import com.ihouse.core.message.ResponseBuilder;
import com.ihouse.core.message.interfaces.Message;
import com.ihouse.core.message.service.IthouseService;
import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.principal.UserPrincipalService;
import jakarta.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ithouse.mshop.contants.ActionType;
import com.ithouse.mshop.core.entity.Login;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.repository.LoginRepo;
import com.ithouse.mshop.core.repository.UserRepo;
import com.ithouse.mshop.core.utils.DocumentFileUtils;

@Service
public class UserService extends IthouseService<List<User>> {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepo userRepo;
    private final LoginRepo loginRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager manager;
    private final UserPrincipalService userPrincipalService;
    private final RoleService roleService;


    public UserService(UserRepo userRepo, LoginRepo loginRepo, PasswordEncoder passwordEncoder, AuthenticationManager manager, UserPrincipalService userPrincipalService, RoleService roleService) {
        this.userRepo = userRepo;
        this.loginRepo = loginRepo;
        this.passwordEncoder = passwordEncoder;
        this.manager = manager;
        this.userPrincipalService = userPrincipalService;
        this.roleService = roleService;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public Message<?> ithouseService(Message requestMessage) throws Exception {

        AbstractMessageHeader header = null;
        Message<?> msgResponse = null;

        try {

            header = requestMessage.getHeader();
            String actionType = header.getActionType();
            log.info("come for action :[{}]", actionType);
            if (actionType.equals(ActionType.ACTION_LOGIN.toString())) {
                List<User> userList = login(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, userList);
            } else if (actionType.equals(ActionType.ACTION_REGISTER.toString())) {
                List<User> userList = registration(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, userList);
            } else if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
                Page<User> userList = select(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, userList);
            } else if (actionType.equals(ActionType.ACTION_LOGOUT.toString())) {
                User user = logout(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, user);
            } else if (actionType.equals(ActionType.LOAD_DETAILS.toString())) {
                User user = loadDetails(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, user);
            } else if (actionType.equals(ActionType.BUILD_IMAGE.toString())) {
                String img = buildImage(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, img);
            } else if (actionType.equals(ActionType.UPDATE.toString())) {
                User user = updateUser(requestMessage, actionType);
                msgResponse = ResponseBuilder.buildResponse(header, user);
            } else {
                log.info("No action handle [{}]", actionType);
            }

        } catch (Exception ex) {
            msgResponse = ResponseBuilder.buildErrorResponse(header, ex);
            msgResponse.getHeader().setExtraInfoMap(null);
            log.error("Exception Message **** [{}]", ex.getMessage());

        }

        return msgResponse;
    }

    private User updateUser(Message<List<User>> requestMessage, String actionType) {
        User user = requestMessage.getPayload().getFirst();

        User dbUser = userRepo.findById(requestMessage.getHeader().getUserId().longValue()).orElse(null);
        if (dbUser != null) {
            dbUser.setDob(user.getDob());
            dbUser.setEmail(user.getEmail());
            dbUser.setFirstName(user.getFirstName());
            dbUser.setLastName(user.getLastName());
            dbUser.setMiddleName(user.getMiddleName());
            dbUser.setFullName(user.getFullName());
            dbUser.setAddress(user.getAddress());
            dbUser.setPhoneNumber(user.getPhoneNumber());
            dbUser.setCountry(user.getCountry());
            userRepo.save(dbUser);
        }
        return dbUser;
    }

    private String buildImage(Message<List<User>> requestMessage, String actionType) throws IOException {
        return buildPath2Base64(requestMessage.getPayload().getFirst().getProfileImagePath());
    }

    private User loadDetails(Message<List<User>> requestMessage, String actionType) {
        Long userId = requestMessage.getHeader().getUserId().longValue();
        String appName = (String) requestMessage.getHeader().getExtraInfoMap().get("appName");
        if (StringUtils.isEmpty(appName)) {
            log.info("can not find appName");
            return null;
        }
        try {
            return buildUserImage(userId, appName);

        } catch (Exception e) {
            log.info("can not find user for userId:appName=[{},{}]", userId, appName);
        }
        return null;
    }

    private User buildUserImage(Long userId, String appName) throws IOException {
        User dbUser = findUser(userId, appName);
        if (!StringUtils.isEmpty(dbUser.getProfileImagePath())) {
            dbUser.setProfileImagePath(buildPath2Base64(dbUser.getProfileImagePath()));
        }
        if (!StringUtils.isEmpty(dbUser.getProfileBannerPath())) {
            dbUser.setProfileBannerPath(buildPath2Base64(dbUser.getProfileBannerPath()));
        }
        return dbUser;
    }

    private String buildPath2Base64(String profileImagePath) throws IOException {
        if (!StringUtils.isEmpty(profileImagePath)) {
            return DocumentFileUtils.file2Base64(profileImagePath);
        }
        return "";
    }

    private List<User> login(Message<List<User>> message, String actionType) throws Exception {

        List<User> userList = null;
        // List<Role> roleList = null;
        User user = null;

        String appName = (String) message.getHeader().getExtraInfoMap().get("appName");

        user = message.getPayload().getFirst();

        doAuthenticate(user);


        User dbUser = userPrincipalService.loadUserByUsername(user.getLoginName()).user();


        if (dbUser != null) {
//            sessionService.expireUserSessions(dbUser.getEmail());
            log.info("dbuser is found for user:[{}]", user.getLoginName());
            if (dbUser.getAllowLogin() != 1) {
                log.info("User is not allow to login: [{}]", dbUser.getUserId());
                throw new AccessDeniedException("You are not allow to login. Please contact the Admin.");
            }
            UserPrincipal userPrincipal = new UserPrincipal(dbUser);
            if (userPrincipal.getAuthorities().isEmpty()) {
                log.info("User authority is not added for userId: [{}]", dbUser.getUserId());
                throw new AccessDeniedException("User access denied. Please contact the Admin.");
            }
            if (!StringUtils.equals(dbUser.getAppName(), appName)) {
                log.info("App name is not match. Db appName, appName:[{},{}]", dbUser.getAppName(), appName);
                throw new RuntimeException("User not found.");
            }

            userList = new ArrayList<>();
            updateLogin(message.getHeader().getSenderSourceIPAddress(), message.getHeader().getSenderGatewayIPAddress(), dbUser, 1, dbUser.getLoginName(), appName);
//                dbUser.setPassword(null);
            userList.add(dbUser);
            return userList;

//            if (isPasswordMatch(dbUser.getPassword(), user.getPassword())) {
//                log.info("Password is mathched");
//                userList = new ArrayList<>();
//                updateLogin(message.getHeader().getSenderSourceIPAddress(), message.getHeader().getSenderGatewayIPAddress(), dbUser, 1, dbUser.getLoginName(), appName);
////                dbUser.setPassword(null);
//                userList.add(dbUser);
//                return userList;
//
//                // lk?
//            } else {
//                log.info("Password not matched.");
//                throw new Exception("Password not matched.");
//            }

        } else {
            log.info("User not found.");
            throw new Exception("User not found.");
        }


    }

    private User logout(Message<List<User>> message, String actionType) throws Exception {
        User user = null;
        String appName = (String) message.getHeader().getExtraInfoMap().get("appName");

        user = message.getPayload().getFirst();

        return logOutUser(user, appName, message.getHeader().getSenderSourceIPAddress(), message.getHeader().getSenderGatewayIPAddress());

    }

    public User logOutUser(User user, String appName, String senderSourceIPAddress, String senderGatewayIPAddress) throws Exception {
//		Long userId = user.getUserId();
        user = userRepo.findById(user.getUserId()).orElse(user);
        updateLogin(senderSourceIPAddress, senderGatewayIPAddress, user, 0, user.getLoginName(), appName);

        return user;
    }

    private void updateLogin(String senderSourceIPAddress, String senderGatewayIPAddress, User user, int loginLogout, String loginName, String appName)
            throws Exception {
        Login login = new Login();
        login.setUserId(user.getUserId());

        if (loginLogout == 0) {
            login.setLogoutTime(new Date());
        } else {
            login.setLoginTime(new Date());
        }
        login.setAppName(appName);
        login.setLoginName(loginName);
        login.setGateway(senderGatewayIPAddress);
        login.setIpAddr(senderSourceIPAddress);
        login.setLogin(loginLogout);
        loginRepo.save(login);
    }

    private boolean isPasswordMatch(String dbPass, String testPass) {
        return passwordEncoder.matches(testPass, dbPass);
    }

    public List<User> registration(@Valid Message<List<User>> requestMessage, String actionType) {

        log.info(requestMessage.getPayload().get(0).getEmail());

        User usr = requestMessage.getPayload().get(0);
        if (usr != null) {

            usr.setAppName((String) requestMessage.getHeader().getExtraInfoMap().get("appName"));
            usr.setPassword(passwordEncoder.encode(usr.getPassword()));
            usr = saveNewUser(usr);
        }
        return Arrays.asList(usr);
    }

    private User saveNewUser(User usr) {

        usr.setAllowLogin(1);
        usr.setCreateDate(new Date());
        usr.setLoginName(StringUtils.isEmpty(usr.getLoginName()) ? usr.getEmail() : usr.getLoginName());
        if (usr.getRoles().isEmpty()) {
            usr.setRoles(roleService.findRoleByRoleName("USER"));
        }
        userRepo.save(usr);
        return usr;
    }

    public Page<User> select(Message<List<User>> message, String actionType) {
        User user = message.getPayload().getFirst();
        Pageable pageable = PageRequest.of(user.getPageNumber() - 1, user.getPageSize(),
                Sort.by("loginName").descending());

        return getAll(pageable);
    }

    public Page<User> getAll(Pageable pageable) {
        return userRepo.findAllByActive(1, pageable);
    }

    public boolean isEmptyUser() {
        return userRepo.count() > 0 ? false : true;
    }

    public void saveInitialValue(@NonNull User usr) {
        log.info("try to save initial value");
        userRepo.save(usr);
    }

    // public UserDetailsService userDetailsService() {
    // return new UserDetailsService(){
    // @Override
    // public UserDetails loadUserByUsername(String username){
    // User usr = userRepo.findAllByLoginNameOrEmail(username, username);
    // if(usr != null){
    // return usr;
    // }
    // else{
    // throw new UsernameNotFoundException("User not found");
    // }
    // }
    // };
    // }

    public void doAuthenticate(User user) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user.getLoginName(),
                user.getPassword());
        try {
            manager.authenticate(auth);
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid user name or password");
        }
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandle() {
        return "Creadentials Invalid!!!";
    }

    public List<User> getAllUsers() {
        // TODO Auto-generated method stub
        return userRepo.findAll();
    }

    public User findUser(Long userId, String appName) {
        return userRepo.findAllByUserIdAndAppNameAndActive(userId, appName, 1);
    }

    public User findUser(Long userId) {
        return userRepo.findAllByUserIdAndActive(userId, 1);
    }

    public User userLogOut(Long userId, String appName, String senderSourceIPAddress, String senderGatewayIPAddress) throws Exception {
        if (userId == null) {
            throw new UsernameNotFoundException("Logout failed.");
        }
        User usr = findUser(userId, appName);
        if (usr == null) {
            throw new UsernameNotFoundException("User not found.");
        }
        return logOutUser(usr, appName, senderSourceIPAddress, senderGatewayIPAddress);
    }
}
