package com.ithouse.mshop.core.repository;

import com.ithouse.mshop.core.entity.SConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SConfigurationRepo extends JpaRepository<SConfiguration,Integer> {
    List<SConfiguration> findAllByConfigGroupAndActive(String configGroup, int active);
}
