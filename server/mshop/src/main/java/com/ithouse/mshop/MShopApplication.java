package com.ithouse.mshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

import com.ithouse.mshop.core.config.AppConfig;

@SpringBootApplication
@Import(AppConfig.class)
public class MShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(MShopApplication.class, args);
	}

}
