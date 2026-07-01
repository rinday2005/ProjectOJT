package org.example.userservice.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Configuration;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
public class FlywayConfig implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof Flyway) {
            Flyway flyway = (Flyway) bean;
            try {
                flyway.repair();
            } catch (Exception e) {
                // Ignore if database is not reachable yet
            }
        }
        return bean;
    }
}
