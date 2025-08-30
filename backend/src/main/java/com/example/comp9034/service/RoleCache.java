package com.example.comp9034.service;

import java.util.Map;

public interface RoleCache {
    Map<Integer, String> getAllRoles();
    String getRoleDescriptionById(int id);
    int getRoleIdByDescription(String description);
}
