package com.attendance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiAttendanceSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiAttendanceSystemApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner seedData(com.attendance.repository.UserRepository userRepo) {
		return args -> {
			if (userRepo.count() == 0) {
				System.out.println("No users found. Seeding initial system users...");
				seedUser(userRepo, 101L, "System User 1", "admin@example.com");
			} else {
				System.out.println("Database already contains users. Skipping seeding.");
			}
		};
	}

	private void seedUser(com.attendance.repository.UserRepository repo, Long id, String name, String email) {
		if (repo.findByEmail(email).isEmpty()) {
			com.attendance.model.User user = new com.attendance.model.User();
			user.setId(id);
			user.setName(name);
			user.setEmail(email);
			user.setPassword("password");
			user.setRole("USER");
			com.attendance.model.User saved = repo.save(user);
			System.out.println("Seeded " + name + " - Requested ID: " + id + ", Got ID: " + saved.getId());
		} else {
			System.out.println(name + " already exists.");
		}
	}
}
