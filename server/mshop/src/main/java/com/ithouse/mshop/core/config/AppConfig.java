package com.ithouse.mshop.core.config;

import com.ithouse.core.message.interfaces.Service;
import com.ithouse.core.message.processor.services.ProcessorService;
import com.ithouse.core.message.services.PublicMapService;
import com.ithouse.core.message.services.ServiceCoordinator;
import com.ithouse.core.message.services.ServiceMap;
import com.ithouse.mshop.contants.ActionType;
import com.ithouse.mshop.core.entity.AppPermission;
import com.ithouse.mshop.core.entity.Role;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.service.AppPermissionService;
import com.ithouse.mshop.core.service.RoleService;
import com.ithouse.mshop.core.service.UserService;
import com.ithouse.mshop.shop.entity.Product;
import com.ithouse.mshop.shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
@EnableScheduling
@ComponentScan(basePackages = {"com.ithouse.mshop"})
public class AppConfig {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private AppPermissionService appPermissionService;

    @Autowired
    private RoleService roleService;

//    private final RegexRepo regexRepo;
//
//    List<Regex> regexList;

//    @PostConstruct
//    public void init() {
//        regexList = regexRepo.findAll();
//    }

    @Bean
    public ServiceCoordinator ServiceCoordinator() {
        ServiceCoordinator sc = new ServiceCoordinator();
        sc.setServiceMap(serviceMap());
        sc.setPublicMapService(publicMapService());
        return sc;
    }

    public ServiceMap serviceMap() {
        ServiceMap serviceMap = new ServiceMap();
        Map<String, Service<?>> map = new LinkedHashMap<>();
        /*
         * here add all your service
         * ex=>
         * map.put(service.class.getSimpleName(), serviceObj)
         */
        map.put(UserService.class.getSimpleName(), userService);
        map.put(ProductService.class.getSimpleName(), productService);
        map.put(AppPermissionService.class.getSimpleName(), appPermissionService);
        map.put(RoleService.class.getSimpleName(), roleService);

        serviceMap.setServiceMap(map);
        return serviceMap;
    }

    public PublicMapService publicMapService() {
        PublicMapService service = new PublicMapService();
        addPublicMapping(service, ActionType.ACTION_LOGIN, User.class.getSimpleName(), userService);
        addPublicMapping(service, ActionType.ACTION_LOGOUT, User.class.getSimpleName(), userService);

        return service;
    }

    private void addPublicMapping(PublicMapService pService, ActionType actionType, String contentType, Service<?> service) {
        if (actionType == null || service == null || contentType == null) {
            throw new IllegalArgumentException("ActionType and Service must not be null");
        }
        pService.setMap(actionType.toString(), contentType, service);
    }

    @Bean
    public ProcessorService processorService() {
        ProcessorService processorService = new ProcessorService();
        Map<String, String> classMap = new LinkedHashMap<>();

        /*
         * here add your service class ie, entity
         * example=>
         * mapClass(classMap, entity.class)
         */
        mapClass(classMap, User.class);
        mapClass(classMap, Product.class);
        mapClass(classMap, AppPermission.class);
        mapClass(classMap, Role.class);

        processorService.setClassMap(classMap);
        return processorService;
    }

    private void mapClass(Map<String, String> classMap, Class<?> clazz) {
        classMap.put(clazz.getSimpleName(), clazz.getName());
    }

}
