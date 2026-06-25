package org.example.userservice.dto.response;

public record DashboardStatsResponse(
    long totalPatients,
    long totalCaregivers,
    long totalFamilies,
    long activeContracts,
    long todaySchedules,
    long completedToday,
    double monthlyRevenue,
    long pendingPayments
) {}
