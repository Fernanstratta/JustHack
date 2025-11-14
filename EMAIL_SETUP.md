# Email Setup Instructions

## Setting up Email Sending

This app now uses **Nodemailer** to send real emails. Follow these steps to configure it:

### 1. Install Nodemailer

\`\`\`bash
npm install nodemailer
npm install --save-dev @types/nodemailer
\`\`\`

### 2. Configure Environment Variables

Create a `.env.local` file in your project root and add:

\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@cetys.edu.mx
SMTP_PASS=your-app-password
SMTP_FROM=justificantes@cetys.edu.mx
\`\`\`

### 3. Email Provider Setup

#### Option A: Gmail
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an "App Password": https://myaccount.google.com/apppasswords
4. Use the generated password in `SMTP_PASS`

#### Option B: Outlook/Office 365
\`\`\`env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@cetys.edu.mx
SMTP_PASS=your-password
\`\`\`

#### Option C: Custom SMTP Server
Use your university's SMTP server settings provided by IT department.

### 4. Test the Email

1. Start your development server
2. Fill out the justificante form
3. Select students and validate
4. Send the email through the email sender component
5. Check if the email arrives successfully

### Troubleshooting

- **Authentication Error**: Check your email and password
- **Connection Refused**: Verify SMTP host and port
- **TLS Error**: Try changing `SMTP_SECURE` to `true` and port to `465`
- **Firewall Issues**: Ensure your network allows SMTP connections
