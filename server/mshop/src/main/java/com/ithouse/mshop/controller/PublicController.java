package com.ithouse.mshop.controller;

import com.google.gson.Gson;
import com.ihouse.core.constants.Constants;
import com.ihouse.core.message.AbstractMessageHeader;
import com.ihouse.core.message.GenericMessage;
import com.ihouse.core.message.interfaces.Message;
import com.ihouse.core.message.processor.service.ProcessorService;
import com.ihouse.core.message.service.ServiceCoordinator;
import com.ithouse.mshop.contants.ActionType;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.model.AccessTokenResponse;
import com.ithouse.mshop.core.model.LoginRes;
import com.ithouse.mshop.core.principal.UserPrincipal;
import com.ithouse.mshop.core.security.service.AuthService;
import com.ithouse.mshop.core.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:321"}, allowCredentials = "true")
@RestController
@RequestMapping(value = "/public")
public class PublicController {
    private static final Logger log = LoggerFactory.getLogger(PublicController.class);
    private static final String VIA = "VIA";

    private final ProcessorService processorService;

    private final ServiceCoordinator serviceCoordinator;


    // @Autowired
    // SecurityService securityService;

    private final UserService userService;

    private final AuthService authService;

    Gson gson = null;

    {
        gson = new Gson();
    }

    public PublicController(ProcessorService processorService, ServiceCoordinator serviceCoordinator, UserService userService, AuthService authService) {
        this.processorService = processorService;
        this.serviceCoordinator = serviceCoordinator;
        this.userService = userService;
        this.authService = authService;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @PostMapping("/login")
    public LoginRes login(@RequestBody String json, HttpServletRequest req, @RequestParam(value = "expired", required = false) String expired,
                          @RequestParam(value = "invalid-session", required = false) String invalidSession, HttpSession session) {

        if (expired != null) {
            throw new SessionAuthenticationException("Your session has expired. Please log in again.");
        } else if (invalidSession != null) {
            throw new SessionAuthenticationException("Your session has expired. Please log in again.");
        }
        log.trace("UI request \n{}", json);
        log.info("request: {}", json);

        Message requestMessage = null;

        try {
            requestMessage = processorService.fromJson(json);
            requestMessage.getHeader().setSenderSourceIPAddress(req.getRemoteAddr());
            requestMessage.getHeader().setSenderGatewayIPAddress(req.getHeader(VIA));
            String actionType = requestMessage.getHeader().getActionType();
            // String content = requestMessage.getHeader().getContentType();

            if (actionType.equals(ActionType.ACTION_LOGIN.toString())) {

                return handleLogin(requestMessage, session);
            }

        } catch (Exception e) {
            log.error("Exception processing message [{}]", e.getMessage());
        }
        // return serverResponse;
        return new LoginRes();
    }

    private LoginRes handleLogin(Message<List<User>> requestMessage, HttpSession session) throws Exception {
        LoginRes login = new LoginRes();
        String reqPass = requestMessage.getPayload().getFirst().getPassword();
        Message<?> res = userService.ithouseService(requestMessage);
        log.info("Login");

        session.setAttribute("user", res.getPayload());
        if (!res.getHeader().getStatus().equals(Constants.STATUS_OK)) {
            AbstractMessageHeader header = res.getHeader();
            GenericMessage<User> m = new GenericMessage<User>();
            header.setStatus(Constants.STATUS_ERROR);
            m.setHeader(header);
            login.setRes(m);
            return login;
        }
        login.setRes(res);

        List<User> u = (List<User>) res.getPayload();

        if (u == null || u.isEmpty()) {
            return login;
        }

        User user = u.getFirst();

        long iss = System.currentTimeMillis();

        Date issuedAt = new Date(iss);
//		Date expAt = DateUtils.addHours(issuedAt, 2);
        // new Date(iss + SecurityService.tokenExpSec);

        // String token = JwtTkProver.generateToken(user, issuedAt, expAt);
//		String token = jwtHelper.genarateToken(user, issuedAt, expAt);
//        AccessTokenRequest tokenRequest = new AccessTokenRequest();
//        tokenRequest.setUsername(user.getEmail());
//        tokenRequest.setPassword(reqPass);

        AccessTokenResponse tokenRes = authService.authenticateAndCreateToken(new UserPrincipal(user));
//		if (tokenRes.getStatus().equals("0000")) {
        login.setToken("Bearer " + tokenRes.getAccessToken());
        login.setExpireAt(tokenRes.getExpireOn());
        login.setIssuedAt(issuedAt);
        login.setAuthenticated(true);

        login.setRes(res);
        return login;
//		}
//
//		return null;
    }

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/jsonRequest", method = RequestMethod.POST, produces = "application/json")
    public String handleJsonRequest(@RequestBody String json, HttpServletRequest req) {

        log.trace("UI request \n{}", json);

        Message requestMessage = null;
        Message processedMessage = null;
        String serverResponse = null;
        try {
            requestMessage = processorService.fromJson(json);
            requestMessage.getHeader().setSenderSourceIPAddress(req.getRemoteAddr());
            requestMessage.getHeader().setSenderGatewayIPAddress(req.getHeader(VIA));
            log.info(requestMessage.getPayload().getClass().getSimpleName());
            processedMessage = serviceCoordinator.service(requestMessage);
            serverResponse = processorService.toJson(processedMessage);
        } catch (Exception e) {
            log.error("Exception processing message [{}]", e);
        }
        return serverResponse;
    }

    @GetMapping("/t")
    public String ttt() {
        return "ok";
    }

//	private final ExecutorService executorService = Executors.newThreadPerTaskExecutor(new VirtualThreadFactory());
//
//	@GetMapping("/users")
//    public CompletableFuture<List<User>> getAll() throws InterruptedException {
////        Thread.sleep(1000); // Simulate delay
//        log.info("my thread is [{}]", Thread.currentThread().getName());
//        return CompletableFuture.supplyAsync(() -> {
//            List<User> users = userService.getAllUsers();
//            return users;
//        });
//    }
//	
//	static class VirtualThreadFactory implements ThreadFactory {
//        @Override
//        public Thread newThread(Runnable r) {
//            return Thread.ofVirtual().start(r);
//        }
//    }

    @Autowired
    private SessionRegistry sessionRegistry;
    @GetMapping("/session")
    public String getSessionId(HttpSession session) {

        SessionInformation sf = sessionRegistry.getSessionInformation(session.getId());

        return "Session ID: " + session.getId();
    }

    @RequestMapping(path = "/check", method = RequestMethod.POST)
    public ResponseEntity<?> checkValid(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            // Collect error messages from the BindingResult object
            List<String> errorMessages = result.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)  // Get the message from @RegexMatch
                    .toList();
//            result.getFieldError().getField()
            // Return errors as a JSON response
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        log.info("checkValid");

        return ResponseEntity.ok("success");
    }

}
