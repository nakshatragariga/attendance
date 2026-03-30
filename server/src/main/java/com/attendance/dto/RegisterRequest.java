package com.attendance.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String section;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
}
