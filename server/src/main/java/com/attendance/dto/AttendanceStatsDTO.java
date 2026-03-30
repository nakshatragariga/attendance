package com.attendance.dto;

public class AttendanceStatsDTO {
    private long totalPresent;
    private long totalDays;
    private double percentage;
    private String statusLabel; // e.g. "On Track", "Low Attendance"

    public AttendanceStatsDTO() {}

    public AttendanceStatsDTO(long totalPresent, long totalDays, double percentage, String statusLabel) {
        this.totalPresent = totalPresent;
        this.totalDays = totalDays;
        this.percentage = percentage;
        this.statusLabel = statusLabel;
    }

    public long getTotalPresent() { return totalPresent; }
    public void setTotalPresent(long totalPresent) { this.totalPresent = totalPresent; }

    public long getTotalDays() { return totalDays; }
    public void setTotalDays(long totalDays) { this.totalDays = totalDays; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public String getStatusLabel() { return statusLabel; }
    public void setStatusLabel(String statusLabel) { this.statusLabel = statusLabel; }
}
