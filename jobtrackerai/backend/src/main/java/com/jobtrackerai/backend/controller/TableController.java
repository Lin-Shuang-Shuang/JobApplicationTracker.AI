package com.jobtrackerai.backend.controller;

import com.jobtrackerai.backend.model.JobApplication;
import com.jobtrackerai.backend.model.dto.DeleteRequest;
import com.jobtrackerai.backend.model.dto.JobApplicationDto;
import com.jobtrackerai.backend.service.JobApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/table")
public class TableController {
    private final JobApplicationService jobApplicationService;
    public TableController(final JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<JobApplicationDto>> getTable() {
        List<JobApplication> jobApplications = jobApplicationService.getJobApplications();
        if (jobApplications.isEmpty()) return ResponseEntity.notFound().build();
        List<JobApplicationDto> jobApplicationDtos = new ArrayList<>();
        for (JobApplication jobApplication : jobApplications) {
            jobApplicationDtos.add(new JobApplicationDto(jobApplication));
        }
        return ResponseEntity.ok(jobApplicationDtos);
    }

    @PutMapping("/status")
    public ResponseEntity<JobApplicationDto> updateStatus(@RequestParam Long id, @RequestParam String newStatus) {
        JobApplication jobApplication = jobApplicationService.updateJobApplicationStatus(id, newStatus);
        if (jobApplication==null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(new JobApplicationDto(jobApplication));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteApplications(@RequestBody DeleteRequest deleteRequest) {
        jobApplicationService.deleteJobApplications(deleteRequest.getIds());
        return ResponseEntity.ok("Deleted");
    }

    @PutMapping("/update")
    public ResponseEntity<JobApplication> updateApplication(@RequestParam Long id, @RequestBody JobApplication jobApplication) {
        JobApplication jobApplication1 = jobApplicationService.updateApplication(id, jobApplication);
        if (jobApplication1==null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(jobApplication1);
    }

}
