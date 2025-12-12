package com.ithouse.mshop.core.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ithouse.core.anotations.injectors.ItHouseDBValueInjector;
import com.ithouse.core.anotations.provider.ItHouseConfigProvider;
import com.ithouse.core.anotations.services.ItHouseDBValueService;
import com.ithouse.mshop.core.entity.SConfiguration;
import com.ithouse.mshop.core.service.SConfigurationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Configuration
public class ItHouseDBValueProvider {
    private static final Logger log = LoggerFactory.getLogger(ItHouseDBValueProvider.class);
    private final SConfigurationService sConfigurationService;
    Map<String, SConfiguration> configMap = new HashMap<>();

    public ItHouseDBValueProvider(SConfigurationService sConfigurationRepo) {
        this.sConfigurationService = sConfigurationRepo;
    }

    public void setsConfigurations() {
        try{
        List<SConfiguration> configurations = sConfigurationService.findAllByConfigGroupAndActive("APP_CONFIG_GROUP", 1);
        configMap = configurations.stream()
                .collect(Collectors.toMap(
                        m -> m.getConfigGroup() + "::" + m.getConfigSubGroup(),
                        m -> m,
                        (a, b) -> b
                ));
        }catch (Exception e){
            log.error("Getting error=>{}", e.getMessage());
//            throw e;
        }

    }

    @Bean
    public ItHouseConfigProvider itHouseConfigProvider() {
        if (configMap == null || configMap.isEmpty()) {
            setsConfigurations();
        }

        return (group, subGroup) -> {
            SConfiguration cfg = configMap.get(group + "::" + subGroup);
            return cfg != null ? cfg.getValue1() : null;
        };
    }

    @Bean
    public ItHouseDBValueService itHouseDBValueService(ItHouseConfigProvider provider) {
        return new ItHouseDBValueService(Optional.of(provider));
    }

    @Bean
    public ItHouseDBValueInjector itHouseDBValueInjector(ItHouseDBValueService service, ObjectMapper objectMapper) {
        return new ItHouseDBValueInjector(service, objectMapper);
    }

}
