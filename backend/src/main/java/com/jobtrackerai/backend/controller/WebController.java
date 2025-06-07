package com.jobtrackerai.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
    // Handle root path
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }
    
    // Handle specific frontend routes that don't conflict with static resources
    @GetMapping({"/dashboard", "/upload", "/login", "/profile"})
    public String frontendRoutes() {
        return "forward:/index.html";
    }
}
