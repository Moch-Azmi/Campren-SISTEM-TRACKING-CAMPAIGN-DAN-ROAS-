package com.example.controller;

import com.example.model.Campaign;
import com.example.model.Pelanggan;
import com.example.model.PerformanceMetrics;
import com.example.model.Users;
import com.example.repository.PelangganRepository;
import com.example.repository.PerformanceMetricsRepository;
import com.example.repository.UsersRepository;
import com.example.repository.CampaignRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private PelangganRepository userRepository;

    @Autowired
    private UsersRepository usersRepository;
    
    @Autowired
    private PerformanceMetricsRepository performanceRepository;
    
    @Autowired
    private CampaignRepository campaignRepository;
    // LOGIN
    @PostMapping("/login")
    public String login(@RequestBody Pelanggan loginRequest) {

        System.out.println("Input email: " + loginRequest.getEmail());
        System.out.println("Input password: " + loginRequest.getPassword());

        Optional<Pelanggan> user =
                userRepository.findByEmail(loginRequest.getEmail());

        if (user.isPresent()) {
            System.out.println("Database password: " + user.get().getPassword());
        } else {
            System.out.println("User not found in database.");
        }

        if (user.isPresent() &&
            user.get().getPassword().equals(loginRequest.getPassword())) {
            return "registered";
        }

        return "not registered";
    }

    // REGISTER
    @PostMapping("/register")
public String register(@RequestBody Pelanggan req) {
    try {

        if (userRepository.existsByEmail(req.getEmail())) {
            return "email exists";
        }

        // save pelanggan
        userRepository.save(req);

        // save users
        Users user = new Users();
        user.setRoleId(1);
        user.setEmail(req.getEmail());
        user.setNama(req.getNama());

        usersRepository.save(user);

        return "registered";

    } catch (Exception e) {
        return "failed";
    }
}

    @PostMapping("/change-password")
public String changePassword(@RequestBody Pelanggan request) {

    System.out.println("CHANGE PASSWORD HIT");
    System.out.println("Email: " + request.getEmail());

    Optional<Pelanggan> user = userRepository.findByEmail(request.getEmail());

    if (user.isPresent()) {

        Pelanggan pelanggan = user.get();
        pelanggan.setPassword(request.getPassword());

        userRepository.save(pelanggan);

        return "success";
    }

    return "email not found";
}
@PostMapping("/roas")
public String getMetrics(@RequestBody PerformanceMetrics req) {

    try {

        List<PerformanceMetrics> data =
            performanceRepository.findByCampaignId(req.getCampaignId());

        if (data.isEmpty()) {
            return "campaign not found";
        }

        long totalRevenue = 0;
        long totalCost = 0;
        long totalClicks = 0;
        long totalImpression = 0;

        for (PerformanceMetrics p : data) {
            totalRevenue += p.getRevenue();
            totalCost += p.getCost();
            totalClicks += p.getClicks();
            totalImpression += p.getImpression();
        }

        double roas = 0;
        double ctr = 0;
        double cpc = 0;

        if (totalCost > 0) {
            roas = (double) totalRevenue / totalCost;
        }

        if (totalImpression > 0) {
            ctr = ((double) totalClicks / totalImpression) * 100;
        }

        if (totalClicks > 0) {
            cpc = (double) totalCost / totalClicks;
        }

        return "Return on Ad Spend = " + String.format("%.2f", roas)
             + " | Click-Trough Rate = " + String.format("%.2f", ctr) + "%"
             + " | Cost Per Click = " + String.format("%.2f", cpc);

    } catch (Exception e) {
        return "failed";
    }
}

@PostMapping("/performancereport")
public String performanceReport(@RequestBody PerformanceMetrics req) {

    try {

        Integer campaignId = req.getCampaignId();

        // ambil data campaign
        Optional<Campaign> campaignData =
                campaignRepository.findById(campaignId);

        if (!campaignData.isPresent()) {
            return "campaign not found";
        }

        // ambil data metrics
        List<PerformanceMetrics> metrics =
                performanceRepository.findByCampaignId(campaignId);

        StringBuilder result = new StringBuilder();

        // ===== CAMPAIGN DATA =====
        result.append("=== CAMPAIGN DATA ===\n");
        result.append("Campaign ID : ")
              .append(campaignData.get().getCampaignId()).append("\n");
        result.append("User ID     : ")
              .append(campaignData.get().getUserId()).append("\n");
        result.append("Platform ID : ")
              .append(campaignData.get().getPlatformId()).append("\n");
        result.append("Campaign Name : ")
              .append(campaignData.get().getNamaCampaign()).append("\n\n");

        // ===== PERFORMANCE DATA =====
        result.append("=== PERFORMANCE METRICS ===\n");

        if (metrics.isEmpty()) {
            result.append("No metrics data found.");
            return result.toString();
        }

        for (PerformanceMetrics p : metrics) {

            result.append("Date        : ").append(p.getTanggal()).append("\n");
            result.append("Impression  : ").append(p.getImpression()).append("\n");
            result.append("Clicks      : ").append(p.getClicks()).append("\n");
            result.append("Cost        : ").append(p.getCost()).append("\n");
            result.append("Conversions : ").append(p.getConversions()).append("\n");
            result.append("Revenue     : ").append(p.getRevenue()).append("\n");
            result.append("--------------------------\n");
        }

        return result.toString();

    } catch (Exception e) {
        return "failed";
    }
}
}