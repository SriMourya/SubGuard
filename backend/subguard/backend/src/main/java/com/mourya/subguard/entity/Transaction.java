
package com.mourya.subguard.entity;
import com.mourya.subguard.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private Double amount;

    private String merchant;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}