package com.ithouse.mshop.core.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.lang.reflect.Method;

public class DtoMapper {
    private static final Logger log = LogManager.getLogger(DtoMapper.class);

    public static <P, D> D map(P projection, Class<D> dtoClass) {
        if (projection == null) {
            return null;
        }

        try {
            // Create a new instance of the DTO class
            D dtoInstance = dtoClass.getDeclaredConstructor().newInstance();

            // Iterate over all the methods in the projection and DTO class
            Method[] projectionMethods = projection.getClass().getDeclaredMethods();
            for (Method projectionMethod : projectionMethods) {
                if (projectionMethod.getName().startsWith("get")) {
                    // Get the corresponding setter in the DTO
                    String setterName = projectionMethod.getName().replace("get", "set");
                    try {
                        Method dtoSetter = dtoClass.getMethod(setterName, projectionMethod.getReturnType());
                        dtoSetter.invoke(dtoInstance, projectionMethod.invoke(projection));
                    } catch (NoSuchMethodException e) {
                        // Skip if the DTO does not have the corresponding setter
                        log.debug("No such method: {}", setterName);
                    }
                }
            }

            return dtoInstance;
        } catch (Exception e) {
            throw new RuntimeException("Error mapping projection to DTO", e);
        }
    }
}
