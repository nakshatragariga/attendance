package com.attendance.service;

import com.attendance.dto.AttendanceStatsDTO;
import com.attendance.dto.StudentReportDTO;
import com.attendance.model.Attendance;
import com.attendance.model.User;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    public List<Attendance> getAll() {
        return attendanceRepository.findAllByOrderByIdDesc();
    }

    public List<Attendance> getByUserId(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    public AttendanceStatsDTO getAttendanceStats(Long userId) {
        long totalPresent = attendanceRepository.countByUserId(userId);
        
        long systemDays = getSystemDays();
        if (systemDays == 0) {
            return new AttendanceStatsDTO(0, 0, 0, "No Data");
        }

        double percentage = (double) totalPresent / systemDays * 100;
        String label = percentage >= 75 ? "On Track" : "Low Attendance";

        return new AttendanceStatsDTO(totalPresent, systemDays, Math.round(percentage * 10.0) / 10.0, label);
    }

    private long getSystemDays() {
        List<Attendance> allAttendance = attendanceRepository.findAllByOrderByIdDesc();
        return allAttendance.stream()
                .map(Attendance::getDate)
                .distinct()
                .count();
    }

    public List<StudentReportDTO> getLowAttendanceReport(double threshold) {
        List<User> students = userRepository.findByRole("STUDENT");
        long systemDays = getSystemDays();

        return students.stream()
                .map(s -> {
                    long present = attendanceRepository.countByUserId(s.getId());
                    double percentage = systemDays > 0 ? (double) present / systemDays * 100 : 0;
                    return new StudentReportDTO(s.getId(), s.getName(), Math.round(percentage * 10.0) / 10.0, present);
                })
                .filter(report -> report.getAttendancePercentage() < threshold)
                .collect(java.util.stream.Collectors.toList());
    }

    public Attendance markAttendance(Long userId, String status) {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        Optional<Attendance> existing = attendanceRepository.findByUserIdAndDate(userId, today);
        
        if (existing.isPresent()) {
            System.out.println("Attendance already marked for user " + userId + " today.");
            return existing.get();
        }

        Attendance attendance = new Attendance();
        attendance.setUserId(userId);
        attendance.setDate(today);
        attendance.setTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        attendance.setStatus(status != null ? status : "PRESENT");
        return attendanceRepository.save(attendance);
    }
}
