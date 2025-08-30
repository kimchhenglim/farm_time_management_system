package com.example.comp9034.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.comp9034.repository.RoleRepository;
import com.example.comp9034.service.RoleCache;

import jakarta.annotation.PostConstruct;

@Service
public class RoleCacheImpl implements RoleCache{
    private final RoleRepository roleRepository;
    Map<Integer, String> roleMap = new HashMap<>();

    RoleCacheImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

//    @PostConstruct
//    public void init() {
//        roleRepository.findAll().forEach(r -> roleMap.put(r.getId(), r.getDescription()));
//    }

    @Override
    public Map<Integer, String> getAllRoles() {
        return roleMap;
    }

    public String getRoleDescriptionById(int id) {
        return roleMap.get(id).toUpperCase();
    }

    public int getRoleIdByDescription(String description) {
        int id = 1;
        for(var entry : roleMap.entrySet()) {
            if (entry.getValue().equals(description.toLowerCase())) {
                id = entry.getKey();
                break;
            }
        }

        return id;
    }
    
}
