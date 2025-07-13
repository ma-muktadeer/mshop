package com.ithouse.mshop.core.config;

import com.ihouse.core.message.interfaces.Service;
import com.ihouse.core.message.processor.service.ProcessorService;
import com.ihouse.core.message.service.ServiceCoordinator;
import com.ihouse.core.message.service.ServiceMap;
//import com.ihouse.core.message.validator.service.RegexCoordinator;
//import com.ihouse.core.message.validator.service.RegexMap;
import com.ithouse.mshop.core.entity.Regex;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.repository.RegexRepo;
import com.ithouse.mshop.core.service.UserService;
import com.ithouse.mshop.shop.entity.Product;
import com.ithouse.mshop.shop.service.ProductService;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableScheduling
@ComponentScan(basePackages = { "com.ithouse.mshop" })
public class AppConfig {

	private final UserService userService;

	private final ProductService productService;

	private final RegexRepo regexRepo;

	List<Regex> regexList;

	public AppConfig(UserService userService, ProductService productService, RegexRepo regexRepo) {
		this.userService = userService;
        this.productService = productService;
		this.regexRepo = regexRepo;
	}

	@PostConstruct
	public void init() {
		regexList = regexRepo.findAll();
	}

	@Bean
	public ServiceCoordinator ServiceCoordinator() {
		ServiceCoordinator sc = new ServiceCoordinator();
		sc.setServiceMap(serviceMap());

		return sc;
	}

//	@Bean
//	public RegexCoordinator regexCoordinator() {
//		RegexCoordinator rdc = new RegexCoordinator();
//		rdc.setRegexMap(regexMap());
//		return rdc;
//	}
//
//	private RegexMap regexMap() {
//		RegexMap rm = new RegexMap();
//		Map<String, String> patterns = new LinkedHashMap<>();
////		List<Regex> regexList = regexRepo.findAll();
//		if (regexList.isEmpty()) {
//			return null;
//		}
//		patterns = regexList.stream().collect(Collectors.toMap(Regex::getRegexType, Regex::getRegex));
//
//		rm.setRegexMap(patterns);
//		return rm;
//	}

	@Bean
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

		serviceMap.setServiceMap(map);
		return serviceMap;
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

		processorService.setClassMap(classMap);
		return processorService;
	}

	private void mapClass(Map<String, String> classMap, Class<?> clazz) {
		classMap.put(clazz.getSimpleName(), clazz.getName());
	}

}
