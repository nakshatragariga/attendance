package com.attendance.controller;

import com.attendance.dto.AttendanceStatsDTO;
import com.attendance.dto.StudentReportDTO;
import com.attendance.model.Attendance;
import com.attendance.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Attendance>> getAll() {
        return ResponseEntity.ok(attendanceService.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attendance>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getByUserId(userId));
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<AttendanceStatsDTO> getStats(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getAttendanceStats(userId));
    }

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String status = body.getOrDefault("status", "PRESENT").toString();
        Attendance attendance = attendanceService.markAttendance(userId, status);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/reports/low-attendance")
    public ResponseEntity<List<StudentReportDTO>> getLowAttendanceReport(@RequestParam(defaultValue = "75.0") double threshold) {
        return ResponseEntity.ok(attendanceService.getLowAttendanceReport(threshold));
    }
}
