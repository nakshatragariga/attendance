package com.attendance.dto;

public class StudentReportDTO {
    private Long userId;
    private String name;
    private double attendancePercentage;
    private long presentDays;

    public StudentReportDTO(Long userId, String name, double attendancePercentage, long presentDays) {
        this.userId = userId;
        this.name = name;
        this.attendancePercentage = attendancePercentage;
        this.presentDays = presentDays;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public long getPresentDays() {
        return presentDays;
    }

    public void setPresentDays(long presentDays) {
        this.presentDays = presentDays;
    }
}
