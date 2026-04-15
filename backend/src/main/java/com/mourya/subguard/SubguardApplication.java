package com.mourya.subguard;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SubguardApplication {

	public static void main(String[] args) {
		SpringApplication.run(SubguardApplication.class, args);
	}


//	@Bean
//	CommandLineRunner testEmail(com.mourya.subguard.service.EmailService emailService) {
//		return args -> {
//			emailService.sendEmail(
//					"srimouryavelampati1@gmail.com",
//					"Test Email",
//					"Your SubGuard is working"
//			);
//		};
//	}

}
