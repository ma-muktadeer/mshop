package com.ithouse.mshop.core.service;

import com.ithouse.mshop.core.entity.SConfiguration;
import com.ithouse.mshop.core.repository.SConfigurationRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SConfigurationService {

    private final SConfigurationRepo sConfigurationRepo;

    public SConfigurationService(SConfigurationRepo sConfigurationRepo) {
        this.sConfigurationRepo = sConfigurationRepo;
    }

    public List<SConfiguration> findAllByConfigGroupAndConfigSubGroupAndActive(String appConfigGroup, String appConfigSubgroup, int i) {
        return sConfigurationRepo.findAllByConfigGroupAndConfigSubGroupAndActive(appConfigGroup, appConfigSubgroup, i);
    }
}
