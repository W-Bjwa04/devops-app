# Email Notification Setup

## Quick Fix: Update Your Email Address

Open `Jenkinsfile` and change line 10:

```groovy
RECIPIENTS = 'your-email@example.com'
```

Replace `your-email@example.com` with your actual email address.

### For multiple recipients:
```groovy
RECIPIENTS = 'email1@example.com,email2@example.com,email3@example.com'
```

## Jenkins Email Configuration

Make sure Jenkins Email Extension Plugin is configured:

1. Go to Jenkins → Manage Jenkins → Configure System
2. Find "Extended E-mail Notification" section
3. Configure:
   - **SMTP server**: smtp.gmail.com (for Gmail)
   - **SMTP Port**: 465 (SSL) or 587 (TLS)
   - **Credentials**: Add your email credentials
   - **Default user e-mail suffix**: @gmail.com (optional)

### Gmail Setup:
1. Enable 2-Factor Authentication in your Google account
2. Generate an "App Password":
   - Google Account → Security → 2-Step Verification → App passwords
3. Use the generated password in Jenkins credentials

### Test Email:
After configuration, use "Test Configuration" button to verify emails are working.

## Current Status

✅ Email notifications configured for:
- **Success**: All tests pass
- **Failure**: Build or deployment fails
- **Unstable**: Some tests fail

📧 Emails include:
- Build status
- Test results
- Commit information
- Build logs (attached)
- Direct link to Jenkins build
