package merciaroboticsweb.sponsor_backend;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    private static final List<String[]> sponsorInquiries = new ArrayList<>();

    @PostMapping("/send-html")
    public ResponseEntity<String> sendHtmlEmail(
            @RequestParam String to,
            @RequestParam(required = false) String filePath) {

        String htmlContent = """
            <html>
              <body>
                <h2>Hello from Mercia Robotics!</h2>
                <p>This is a <strong>HTML email</strong> with an optional attachment.</p>
              </body>
            </html>
        """;

        try {
            emailService.sendHtmlEmailWithAttachment(to, "HTML Email from Mercia Robotics", htmlContent, filePath);
            return ResponseEntity.ok("Email sent successfully to " + to);
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/sponsor-inquiry")
    public ResponseEntity<String> sendSponsorInquiry(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String message) {

        // Add new inquiry to the list
        sponsorInquiries.add(new String[]{name, email, message});

        // Build the full table
        StringBuilder textBody = new StringBuilder("All Sponsor Inquiries:\n\n");
        textBody.append(String.format("%-20s | %-30s | %s\n", "Name", "Email", "Message"));
        textBody.append(String.format("%-20s | %-30s | %s\n", "--------------------", "------------------------------", "-------"));
        for (String[] inquiry : sponsorInquiries) {
            textBody.append(String.format("%-20s | %-30s | %s\n", inquiry[0], inquiry[1], inquiry[2]));
        }

        String subject = "Updated Sponsor Inquiries Table";

        try {
            emailService.sendPlainTextEmail("kazmin@mercia.school", subject, textBody.toString());
            return ResponseEntity.ok("Sponsor inquiry sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to send sponsor inquiry: " + e.getMessage());
        }
    }
}
