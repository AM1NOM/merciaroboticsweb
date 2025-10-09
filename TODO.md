# TODO: Complete Sponsor Input Website

## Backend Updates
- [x] Update `application.properties` for Outlook SMTP and sender email
- [x] Update `EmailService` to add plain text email method
- [x] Add sponsor inquiry endpoint in `EmailController`
- [x] Add CORS configuration in `SponsorBackendApplication.java`

## Frontend Updates
- [ ] Add sponsor form fields (name, email, message) in `index.html`
- [ ] Update `script.js` to send POST to backend endpoint instead of local storage

## Testing
- [ ] Run backend server and test sponsor inquiry endpoint with curl/Postman (valid/invalid inputs, edge cases)
- [ ] Run frontend locally and test sponsor form submission
- [ ] Verify plain text emails received in Outlook
- [ ] Test entire flow and fix any bugs

## Followup
- [ ] Address any issues found during testing
