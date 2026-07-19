const nodemailer = require('nodemailer');
const dns = require('dns');

// Initialize transporter. Uses Gmail API via OAuth2 if credentials are provided (recommended for production)
// or falls back to standard Gmail SMTP (recommended for local development)
let transportConfig;

if (process.env.GMAIL_REFRESH_TOKEN) {
  transportConfig = {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USERNAME,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  };
} else {
  transportConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    lookup: (hostname, options, callback) => {
      // Force resolving to IPv4 to prevent IPv6 ENETUNREACH errors on Render/Railway
      return dns.lookup(hostname, { family: 4 }, callback);
    },
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  };
}

const transporter = nodemailer.createTransport(transportConfig);

// A helper function to compile email wrap styling for premium aesthetics
const getEmailWrapper = (title, contentHTML) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7fafc;
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .email-header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .email-body {
      padding: 40px 30px;
      color: #2d3748;
      line-height: 1.6;
    }
    .email-footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #edf2f7;
      font-size: 12px;
      color: #718096;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin: 20px 0;
      background-color: #3b82f6;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: background-color 0.2s ease;
    }
    .btn:hover {
      background-color: #1d4ed8;
    }
    .code-box {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 4px;
      color: #1e3a8a;
      background-color: #eff6ff;
      border: 2px dashed #bfdbfe;
      padding: 15px;
      text-align: center;
      border-radius: 8px;
      margin: 24px 0;
    }
    .highlight-card {
      background-color: #f8fafc;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
    }
    .alert-card {
      background-color: #f0fff4;
      border-left: 4px solid #38a169;
      padding: 15px;
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
      color: #276749;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${title}</h1>
    </div>
    <div class="email-body">
      ${contentHTML}
    </div>
    <div class="email-footer">
      <p>This is an automated email from the Library Management System.</p>
      <p>&copy; ${new Date().getFullYear()} Library Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;



// Helper to send transactional emails via Gmail HTTP API (bypasses SMTP port blocking on cloud providers)
const sendMailViaGmailAPI = async (to, subject, htmlContent) => {
  try {
    // 1. Get access token from refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GMAIL_CLIENT_ID,
        client_secret: process.env.GMAIL_CLIENT_SECRET,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Failed to refresh access token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Construct raw MIME message (RFC 822)
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: "Library System" <${process.env.EMAIL_USERNAME}>`,
      `To: ${to}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      ``,
      htmlContent,
    ];
    const message = messageParts.join('\n');

    // Gmail API expects raw message to be base64url encoded
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // 3. Send email via Gmail API
    const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    });

    if (!sendResponse.ok) {
      const errorText = await sendResponse.text();
      throw new Error(`Gmail API send failed: ${errorText}`);
    }

    const sendData = await sendResponse.json();
    console.log(`[EmailService] Email sent successfully via Gmail API to ${to}. MessageId: ${sendData.id}`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Error sending email via Gmail API to ${to}:`, error);
    return false;
  }
};

// Unified helper to route between Gmail API (Production HTTPS) and SMTP (Local)
const sendEmail = async (to, subject, fullHtml) => {
  if (process.env.GMAIL_REFRESH_TOKEN) {
    const success = await sendMailViaGmailAPI(to, subject, fullHtml);
    if (success) return;
  }

  // Fallback to standard SMTP (Local Development)
  try {
    const mailOptions = {
      from: `"Library System" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html: fullHtml,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent successfully via SMTP to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[EmailService] Error sending email via SMTP to ${to}:`, error);
  }
};

// 1. Send OTP Verification Email (Signup)
const sendOtpEmail = async (to, otp) => {
  const htmlContent = `
    <p>Hello,</p>
    <p>Thank you for registering. To complete your account creation, please verify your email address by entering the following One-Time Password (OTP):</p>
    <div class="code-box">${otp}</div>
    <p style="color: #e53e3e; font-weight: 600;">Note: This code is highly confidential and will expire in 60 seconds.</p>
    <p>If you did not request this, please disregard this email.</p>
  `;
  const subject = 'Verify Your Email - Library Management System';
  const fullHtml = getEmailWrapper('Email Verification', htmlContent);

  await sendEmail(to, subject, fullHtml);
};

// 2. Send Welcome Email (Account Created)
const sendWelcomeEmail = async (to, username) => {
  const htmlContent = `
    <h2>Welcome aboard, ${username}! 🎉</h2>
    <p>Your email has been successfully verified, and your account is now fully active.</p>
    <p>With your account, you can access the following library features:</p>
    <div class="highlight-card">
      <ul style="margin: 0; padding-left: 20px;">
        <li>Search our catalog of physical and digital books.</li>
        <li>Request up to 5 books at a time for pickup.</li>
        <li>Track your borrowing history, return dates, and fine logs.</li>
      </ul>
    </div>
    <p>Head over to the portal to start exploring!</p>
  `;
  const subject = 'Welcome to the Library Management System!';
  const fullHtml = getEmailWrapper('Account Created Successfully', htmlContent);

  await sendEmail(to, subject, fullHtml);
};

// 3. Send Password Reset OTP Email
const sendPasswordResetOtpEmail = async (to, otp) => {
  const htmlContent = `
    <p>Hello,</p>
    <p>We received a request to reset the password for your account. Use the following One-Time Password (OTP) to proceed with the reset:</p>
    <div class="code-box">${otp}</div>
    <p style="color: #e53e3e; font-weight: 600;">Note: This code will expire in 5 minutes.</p>
    <p>If you did not request a password reset, please ignore this email and ensure your password remains secure.</p>
  `;
  const subject = 'Reset Your Password - Library Management System';
  const fullHtml = getEmailWrapper('Password Reset Request', htmlContent);

  await sendEmail(to, subject, fullHtml);
};

// 4. Send Password Reset Success Notification
const sendPasswordResetSuccessEmail = async (to, username) => {
  const htmlContent = `
    <p>Hello ${username},</p>
    <p>This is a confirmation that the password for your Library Management System account was successfully changed.</p>
    <div class="highlight-card" style="border-left-color: #38a169;">
      <strong>Security Check:</strong> If you did not make this change, please contact the library administrator immediately to secure your account.
    </div>
  `;
  const subject = 'Password Changed Successfully - Library Management System';
  const fullHtml = getEmailWrapper('Password Security Alert', htmlContent);

  await sendEmail(to, subject, fullHtml);
};

// 5. Send Book Requested Email
const sendBookRequestedEmail = async (to, username, bookTitle) => {
  const htmlContent = `
    <p>Hello ${username},</p>
    <p>Your request for the book <strong>"${bookTitle}"</strong> has been successfully received.</p>
    <div class="highlight-card">
      <strong>What's Next:</strong>
      <p style="margin: 5px 0 0 0;">The library administration is verifying the availability. We will send you an email notification as soon as it is marked ready for collection.</p>
    </div>
    <p>You can monitor the status of this request directly from your dashboard.</p>
  `;
  const subject = 'Book Request Received - Library Management System';
  const fullHtml = getEmailWrapper('Book Request Confirmed', htmlContent);

  await sendEmail(to, subject, fullHtml);
};

// 6. Send Book Ready For Pickup Email
const sendBookReadyForPickupEmail = async (to, username, bookTitle) => {
  const htmlContent = `
    <p>Hello ${username},</p>
    <p>Great news! The book you requested, <strong>"${bookTitle}"</strong>, is now ready for pickup at the library front desk. 🎉</p>
    <div class="alert-card">
      <strong>Pickup Instructions:</strong>
      <p style="margin: 5px 0 0 0;">Please visit the library desk within <strong>3 working days</strong> to collect your book. Be sure to present your Student / Library Membership ID card to the desk officer.</p>
    </div>
    <p>If you fail to collect the book within 3 days, your reservation will automatically be cancelled.</p>
  `;
  const subject = 'Book Ready for Pickup! - Library Management System';
  const fullHtml = getEmailWrapper('Ready for Pickup', htmlContent);

  await sendEmail(to, subject, fullHtml);
};

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetOtpEmail,
  sendPasswordResetSuccessEmail,
  sendBookRequestedEmail,
  sendBookReadyForPickupEmail,
};
