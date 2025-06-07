package com.jobtrackerai.backend.service;

import com.jobtrackerai.backend.model.JobApplication;

import java.util.List;

public interface JobApplicationService {
    List<JobApplication> getJobApplications();
    JobApplication updateJobApplicationStatus(Long id, String newStatus);
    void deleteJobApplications(List<Long> ids);
    JobApplication updateApplication(Long id, JobApplication jobApplication);
}
