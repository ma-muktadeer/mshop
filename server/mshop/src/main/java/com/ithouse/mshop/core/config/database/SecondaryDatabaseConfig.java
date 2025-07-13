package com.ithouse.mshop.core.config.database;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

//@Configuration
//@EnableTransactionManagement
//@EnableJpaRepositories(
//        basePackages = "com.ithouse.mshop.shop.repo", // Secondary repository package
//        entityManagerFactoryRef = "secondaryEntityManagerFactory",
//        transactionManagerRef = "secondaryTransactionManager"
//)
public class SecondaryDatabaseConfig {

    @Bean(name = "secondaryEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean secondaryEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("secondaryDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.ithouse.mshop.shop.entity") // Secondary entities package
                .persistenceUnit("secondary")
                .properties(secondaryJpaProperties()) // Explicit JPA properties for secondary
                .build();
    }

    @Bean(name = "secondaryTransactionManager")
    public PlatformTransactionManager secondaryTransactionManager(
            @Qualifier("secondaryEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

    private Map<String, Object> secondaryJpaProperties() {
        Map<String, Object> props = new HashMap<>();
        props.put("hibernate.hbm2ddl.auto", "update");
//        props.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect"); // Set the appropriate dialect
        props.put("hibernate.show_sql", true); // Optional: Show SQL in logs
        return props;
    }
}
