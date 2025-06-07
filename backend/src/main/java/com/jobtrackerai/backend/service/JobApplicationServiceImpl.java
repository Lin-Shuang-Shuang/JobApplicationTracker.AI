package com.jobtrackerai.backend.service;

import com.jobtrackerai.backend.model.JobApplication;
import com.jobtrackerai.backend.repository.JobApplicationRepository;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;

@Service
public class JobApplicationServiceImpl implements JobApplicationService{
    private static final Logger LOGGER = LoggerFactory.getLogger(JobApplicationServiceImpl.class);
    private final JobApplicationRepository jobApplicationRepository;
    public JobApplicationServiceImpl(final JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }
    public List<JobApplication> getJobApplications() {
        return jobApplicationRepository.findAll();

    }

    public JobApplication updateJobApplicationStatus(Long id, String newStatus) {
        Optional<JobApplication> jobApplicationOptional = jobApplicationRepository.findById(id);
        if (jobApplicationOptional.isEmpty()) {
            LOGGER.error("Job application ID cannot be found.");
            return null;
        }
        JobApplication jobApplication = jobApplicationOptional.get();
        jobApplication.setStatus(newStatus);
        jobApplicationRepository.save(jobApplication);
        return jobApplication;

    }

    public void deleteJobApplications(List<Long> ids) {
        List<JobApplication> jobApplicationsOptional = jobApplicationRepository.findAllById(ids);
        if (!jobApplicationsOptional.isEmpty()) {
            jobApplicationRepository.deleteAll(jobApplicationsOptional);
        }


    }
    public JobApplication updateApplication(Long id, JobApplication jobApplication) {
        Optional<JobApplication> jobApplicationOptional = jobApplicationRepository.findById(id);
        if (jobApplicationOptional.isEmpty()) {
            LOGGER.error("Cannot find job application.");
            return null;
        }
        JobApplication jobApplicationOrig = jobApplicationOptional.get();
        jobApplicationOrig.setCompany(jobApplication.getCompany());
        jobApplicationOrig.setJobPosition(jobApplication.getJobPosition());
        jobApplicationOrig.setStatus(jobApplication.getStatus());
        jobApplicationOrig.setDateApplied(jobApplication.getDateApplied());
        jobApplicationRepository.save(jobApplicationOrig);
        return jobApplicationOrig;

    }
}
