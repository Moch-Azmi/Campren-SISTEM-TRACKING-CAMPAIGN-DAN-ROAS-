package com.example.controller;

import com.example.model.Campaign;
import com.example.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="*")
public class CampaignController {

    @Autowired
    private CampaignRepository campaignRepository;

    @PostMapping("/campaign")
    public String createCampaign(@RequestBody Campaign campaign){

        campaignRepository.save(campaign);

        return "campaign created";
    }
}