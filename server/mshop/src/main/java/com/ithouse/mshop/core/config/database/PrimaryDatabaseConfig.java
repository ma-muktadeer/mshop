package com.ithouse.mshop.core.config.database;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

//@Configuration
//@EnableTransactionManagement
//@EnableJpaRepositories(
//        basePackages = "com.ithouse.mshop.core.repository",
//        entityManagerFactoryRef = "primaryEntityManagerFactory",
//        transactionManagerRef = "primaryTransactionManager"
//)
public class PrimaryDatabaseConfig {


    @Primary
    @Bean(name = "primaryEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean primaryEntityManagerFactory(
            EntityManagerFactoryBuilder builder, @Qualifier("primaryDataSource") DataSource dataSource
    ) {

        return builder
                .dataSource(dataSource)
                .packages("com.ithouse.mshop.core.entity")
                .persistenceUnit("primary")
                .build();

    }

    @Primary
    @Bean(name = "primaryTransactionManager")
    public PlatformTransactionManager primaryTransactionManager(
            @Qualifier("primaryEntityManagerFactory")EntityManagerFactory entityManagerFactory
            ){
        return new JpaTransactionManager(entityManagerFactory);
    }
}
