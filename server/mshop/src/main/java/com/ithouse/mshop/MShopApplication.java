package com.ithouse.mshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Import;

import com.ithouse.mshop.core.config.AppConfig;

@Import(AppConfig.class)
@SpringBootApplication
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class MShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(MShopApplication.class, args);
	}

}
