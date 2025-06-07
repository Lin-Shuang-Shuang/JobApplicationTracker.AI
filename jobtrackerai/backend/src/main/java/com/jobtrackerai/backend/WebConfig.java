package com.jobtrackerai.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // allow Vite dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // allow preflight and common methods
                .allowedHeaders("*") // allow all headers
                .allowCredentials(true); // only needed if you use cookies/auth

    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(31556926);
        
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/")
                .setCachePeriod(31556926);
                
        registry.addResourceHandler("/index.html")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0);
                
//        registry.addResourceHandler("/vite.svg")
//                .addResourceLocations("classpath:/static/")
//                .setCachePeriod(31556926);
    }
}
