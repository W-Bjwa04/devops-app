# Email Notification Setup

## ⚠️ IMPORTANT: Jenkins SMTP Configuration Required

Your pipeline is ready to send emails to the **commit author's email**, but Jenkins needs **EXTENDED E-mail Notification** configuration (not just regular E-mail Notification).

## Critical: You Must Configure BOTH Sections!

### Section 1: Extended E-mail Notification (REQUIRED)

This is what your pipeline uses for sending emails.

1. Open Jenkins: **Manage Jenkins** → **Configure System**
2. Scroll to **"Extended E-mail Notification"** (NOT "E-mail Notification")
3. Configure these exact settings:
   ```
   SMTP server: smtp.gmail.com
   SMTP Port: 465
   ```
4. Click **"Advanced"** button (next to SMTP server field)
5. **CRITICAL STEP**: Check the box **"Use SSL"**
6. Click **"Add"** next to Credentials → Select **"Jenkins"**
7. Fill credential form:
   - Kind: **Username with password**
   - Scope: Global
   - Username: `your-email@gmail.com`
   - Password: [Your 16-character Gmail App Password]
   - ID: `gmail-smtp`
   - Description: Gmail SMTP for Jenkins
   - Click **"Add"**
8. Now select the credential you just created from dropdown
9. Default Content Type: `text/html`
10. Default Recipients: (leave empty - pipeline will set this)
11. Click **"Apply"**

### Section 2: E-mail Notification (OPTIONAL - for build notifications)

Scroll down to **"E-mail Notification"**:
```
SMTP server: smtp.gmail.com
Click "Advanced":
  ✅ Use SMTP Authentication
  User Name: your-email@gmail.com
  Password: [Your app password]
  ✅ Use SSL
  SMTP Port: 465
```

## How to Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Generate a new app password:
   - App: Mail
   - Device: Other (Jenkins)
5. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### 2. Configure Jenkins Email Extension

1. Open Jenkins: **Manage Jenkins** → **Configure System**
2. Scroll to **Extended E-mail Notification**
3. Configure:
   ```
   SMTP server: smtp.gmail.com
   SMTP Port: 465
   ```
4. Click **Advanced**:
   - ✅ Check "Use SSL"
   - Click **Add** → **Jenkins** (Credentials)
   - Kind: Username with password
   - Username: `your-email@gmail.com`
   - Password: [Paste your 16-character app password]
   - ID: `gmail-smtp`
   - Click **Add**
5. Select the credential you just created
6. Default user e-mail suffix: `@gmail.com`

### 3. Configure Default E-mail Notification (Optional)

Scroll to **E-mail Notification**:
```
SMTP server: smtp.gmail.com
Advanced → Use SMTP Authentication:
  User Name: waleedshahid123ml@gmail.com
  Password: [Your app password]
  Use SSL: ✅
  SMTP Port: 465
```

### 4. Test Configuration

1. Click **Test configuration by sending test e-mail**
2. Test e-mail recipient: `waleedshahid123ml@gmail.com`
3. Click **Test configuration**
4. Check your inbox for test email

### 5. Save and Trigger Build

1. Click **Save** at bottom of page
2. Go to your pipeline and click **Build Now**
3. After build completes, check your email!

## Current Status

✅ **Pipeline configured** to send to: `waleedshahid123ml@gmail.com`  
✅ **Dynamic routing** works (collaborators will receive their emails)  
❌ **SMTP not configured** - Follow steps above

## Email Will Include:

- ✅ **Success**: All 12 tests passed
- ❌ **Failure**: Build or tests failed
- ⚠️ **Unstable**: Some tests failed

Each email contains:
- Build status & number
- Commit info & author
- Test results summary
- Direct Jenkins link
- Full build logs attached

## Troubleshooting

**"Not sent to valid addresses"** → SMTP not configured (follow steps above)  
**"Authentication failed"** → Wrong app password or username  
**"Connection timeout"** → Check firewall/port 465 access  
**"SSL error"** → Make sure "Use SSL" is checked
