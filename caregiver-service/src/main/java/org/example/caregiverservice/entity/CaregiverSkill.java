package org.example.caregiverservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "caregiver_skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaregiverSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private Caregiver caregiver;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(nullable = false, length = 20)
    private String level; // 'BASIC', 'ADVANCED'
}
