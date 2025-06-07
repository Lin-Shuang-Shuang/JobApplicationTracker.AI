package com.jobtrackerai.backend.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class DeleteRequest {
    private List<Long> ids;
}
