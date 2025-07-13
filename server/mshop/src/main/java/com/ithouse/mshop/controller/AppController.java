package com.ithouse.mshop.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ihouse.core.message.interfaces.Message;
import com.ihouse.core.message.processor.service.ProcessorService;
import com.ihouse.core.message.service.ServiceCoordinator;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.repository.UserRepo;
import com.ithouse.mshop.core.service.DocumentFilesService;
import com.ithouse.mshop.core.service.UserService;
import com.ithouse.mshop.core.utils.FileAction;
import com.ithouse.mshop.core.utils.FileType;
import com.ithouse.mshop.shop.projection.ProductProjection;
import com.ithouse.mshop.shop.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Objects;

@CrossOrigin(origins = {"http://localhost:4200"}, allowCredentials = "true", allowedHeaders = {"Authorization", "Content-Type"})
@RestController
@RequestMapping(value = "/secure")
public class AppController {
    private static final Logger log = LoggerFactory.getLogger(AppController.class);
    private static final String VIA = "VIA";

    private final ProcessorService processorService;
    private final ServiceCoordinator serviceCoordinator;

    private final UserRepo userRepo;

    private final DocumentFilesService documentFilesService;
    private final UserService userService;

    public AppController(ProcessorService processorService, ServiceCoordinator serviceCoordinator, UserRepo userRepo, DocumentFilesService documentFilesService, ProductService productRepo, UserService userService) {
        this.processorService = processorService;
        this.serviceCoordinator = serviceCoordinator;
        this.userRepo = userRepo;
        this.documentFilesService = documentFilesService;
        this.productRepo = productRepo;
        this.userService = userService;
    }

    /*
     * @Value("${dateformat:yyyy-MM-dd HH:mm:ss}") private String dateformat;
     *
     * @Value("${use.time:true}") private boolean useTime;
     */

    @RequestMapping(value = "/jsonRequest", method = RequestMethod.POST, produces = "application/json")
    public String handleJsonRequest(@RequestBody String json, HttpServletRequest req, Principal principal) {

        log.debug(json);
        Message<?> requestMessage = null;
        Message<?> processedMessage = null;
        String serverResponse = null;
        try {
            requestMessage = processorService.fromJson(json);
            requestMessage.getHeader().setSenderSourceIPAddress(req.getRemoteAddr());
            requestMessage.getHeader().setSenderGatewayIPAddress(req.getHeader(VIA));
            processedMessage = serviceCoordinator.service(requestMessage);
            serverResponse = processorService.toJson(processedMessage);
        } catch (Exception e) {
            log.error("Exception processig message [{}]", e);
        }

        return serverResponse;
    }

    @RequestMapping(value = "/admin/jsonRequest", method = RequestMethod.POST, produces = "application/json")
    public String adminReq(@RequestBody String json, HttpServletRequest req, Principal principal) {

        return handleJsonRequest(json, req, principal);
    }

    @RequestMapping(value = "/admin/jsonRequest", method = RequestMethod.POST)
    public ResponseEntity<?> handleWithDocuments(@RequestParam(name = "entity", required = false) Object entity,
                                                 @RequestParam(name = "file", required = false) MultipartFile file,
                                                 @RequestParam(name = "action", required = false) String action, Principal principal) {
        if ("save".equals(action)) {
// Save the file
            if (Objects.nonNull(file) && !file.isEmpty()) {
// Implement saving logic here
// Example: fileStorageService.storeFile(file);
                return ResponseEntity.ok("File saved successfully");
            } else {
                return ResponseEntity.badRequest().body("Please provide a file to save");
            }
        } else if ("download".equals(action)) {
// Serve the file for download
            if (Objects.nonNull(file) && !file.isEmpty()) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("attachment", file.getOriginalFilename());
                try {
                    byte[] fileContent = file.getBytes();
                    return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error occurred while processing file");
                }
            } else {
                return ResponseEntity.badRequest().body("File not found for download");
            }
        } else {
            return ResponseEntity.badRequest().body("Invalid action parameter");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(name = "appName") String appName, HttpServletRequest req) throws Exception {
        Long userId = Long.valueOf(req.getHeader("UserId"));
        String senderGatewayIPAddress = req.getHeader("X-Forwarded-For");
        String senderSourceIPAddress = req.getRemoteAddr();

        return ResponseEntity.ok(userService.userLogOut(userId, appName, senderSourceIPAddress, senderGatewayIPAddress));
    }

    @CrossOrigin(origins = "http://localhost:4200", exposedHeaders = "Content-Disposition")
    @PostMapping(value = "/file/handle", produces = "multipart/form-data")
    public ResponseEntity<?> handleWithFile(
            @RequestParam(name = "file", required = false) List<MultipartFile> files,
            @RequestParam(name = "fileType", required = true) FileType fileType,
            @RequestHeader(name = "appName") String appName,
            @RequestHeader(name = "userId") Long userId,
            @RequestParam(name = "action") String action, Principal principal) {

        if (FileAction.SAVE.toString().equals(action)) {
            if (Objects.nonNull(files) && !files.isEmpty()) {
                documentFilesService.saveFile(files, fileType, userId, appName, "USER");
                return ResponseEntity.ok("File saved successfully");
            } else {
                return ResponseEntity.badRequest().body("Please provide a file to save");
            }
        } else if ("download".equals(action)) {
// Serve the file for download
            if (Objects.nonNull(files) && !files.isEmpty()) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("attachment", files.getFirst().getOriginalFilename());
                try {
                    byte[] fileContent = files.getFirst().getBytes();
                    return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error occurred while processing file");
                }
            } else {
                return ResponseEntity.badRequest().body("File not found for download");
            }
        } else {
            return ResponseEntity.badRequest().body("Invalid action parameter");
        }
    }

    @GetMapping("/user")
    public List<User> getMethodName() {
        return userRepo.findAll();
    }

    final ProductService productRepo;

    @PostMapping("/admin/pro")
    public String getMethodPro(@RequestBody(required = false) String methodPro) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
//		return new Gson().toJson(productRepo.findAllActiveProduct());
        List<ProductProjection> p = productRepo.findAllActiveProductP();
        return objectMapper.writeValueAsString(p);
//		return objectMapper.writeValueAsString(productRepo.findAllActiveProductP());
    }

}
