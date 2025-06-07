package com.jobtrackerai.backend.model.dto;

import com.jobtrackerai.backend.model.JobApplication;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class JobApplicationDto {
    @Id
    private Long id;
    private String company;
    private String jobPosition;
    private String status;
    private String dateApplied;

    public JobApplicationDto(JobApplication jobApplication) {
        this.id = jobApplication.getId();
        this.company = jobApplication.getCompany();
        this.jobPosition = jobApplication.getJobPosition();
        this.status = jobApplication.getStatus();
        this.dateApplied = jobApplication.getDateApplied();
    }
}
