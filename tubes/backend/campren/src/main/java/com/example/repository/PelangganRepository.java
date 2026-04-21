package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Pelanggan;
import java.util.Optional;

public interface PelangganRepository extends JpaRepository<Pelanggan, Long> {

    boolean existsByEmail(String email);
    Optional<Pelanggan> findByEmail(String email);
}