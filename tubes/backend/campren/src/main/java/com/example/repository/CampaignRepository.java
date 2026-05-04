package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Campaign;

public interface CampaignRepository extends JpaRepository<Campaign, Integer> {
}