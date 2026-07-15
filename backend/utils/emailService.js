const nodemailer = require('nodemailer');
const dns = require('dns');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS
  lookup: (hostname, options, callback) => {
    // Force resolving to IPv4 to prevent IPv6 ENETUNREACH errors on Render
    return dns.lookup(hostname, { family: 4 }, callback);
  },
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

// 1. Send OTP Verification Email (Signup)
const sendOtpEmail = async (to, otp) => {
  try {
    const htmlContent = `
      <p>Hello,</p>
      <p>Thank you for registering. To complete your account creation, please verify your email address by entering the following One-Time Password (OTP):</p>
      <div class="code-box">${otp}</div>
      <p style="color: #e53e3e; font-weight: 600;">Note: This code is highly confidential and will expire in 60 seconds.</p>
      <p>If you did not request this, please disregard this email.</p>
    `;
    const mailOptions = {
      from: `"Library System" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Verify Your Email - Library Management System',
      html: getEmailWrapper('Email Verification', htmlContent),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] OTP email sent successfully to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[EmailService] Error sending OTP email to ${to}:`, error);
  }
};

// 2. Send Welcome Email (Account Created)
const sendWelcomeEmail = async (to, username) => {
  try {
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
    const mailOptions = {
      from: `"Library System" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Welcome to the Library Management System!',
      html: getEmailWrapper('Account Created Successfully', htmlContent),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Welcome email sent successfully to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[EmailService] Error sending Welcome email to ${to}:`, error);
  }
};

// 3. Send Password Reset OTP Email
const sendPasswordResetOtpEmail = async (to, otp) => {
  try {
    const htmlContent = `
      <p>Hello,</p>
      <p>We received a request to reset the password for your account. Use the following One-Time Password (OTP) to proceed with the reset:</p>
      <div class="code-box">${otp}</div>
      <p style="color: #e53e3e; font-weight: 600;">Note: This code will expire in 5 minutes.</p>
      <p>If you did not request a password reset, please ignore this email and ensure your password remains secure.</p>
    `;
    const mailOptions = {
      from: `"Library System" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Reset Your Password - Library Management System',
      html: getEmailWrapper('Password Reset Request', htmlContent),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Password reset OTP sent successfully to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[EmailService] Error sending password reset OTP to ${to}:`, error);
  }
};

// 4. Send Password Reset Success Notification
const sendPasswordResetSuccessEmail = async (to, username) => {
  try {
    const htmlContent = `
      <p>Hello ${username},</p>
      <p>This is a confirmation that the password for your Library Management System account was successfully changed.</p>
      <div class="highlight-card" style="border-left-color: #38a169;">
        <strong>Security Check:</strong> If you did not make this change, please contact the library administrator immediately to secure your account.
      </div>
    `;
    const mailOptions = {
      from: `"Library System" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Password Changed Successfully - Library Management System',
      html: getEmailWrapper('Password Security Alert', htmlContent),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Password change alert email sent successfully to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[EmailService] Error sending password change alert to ${to}:`, error);
  }
};

// 5. Send Book Requested Email
const sendBookRequestedEmail = async (to, username, bookTitle) => {
  try {
    const htmlContent = `
      <p>Hello ${username},</p>
      <p>Your request for the book <strong>"${bookTitle}"</strong> has been successfully received.</p>
      <div class="highlight-card">
        <strong>What's Next:</strong>
        <p style="margin: 5px 0 0 0;">The library administration is verifying the availability. We will send you an email notification as soon as it is marked ready for collection.</p>
      </div>
      <p>You can monitor the status of this request directly from your dashboard.</p>
    `;
    const mailOptions = {
      from: `"Library System" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Book Request Received - Library Management System',
      html: getEmailWrapper('Book Request Confirmed', htmlContent),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Book request confirmation sent successfully to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[EmailService] Error sending book request confirmation to ${to}:`, error);
  }
};

// 6. Send Book Ready For Pickup Email
const sendBookReadyForPickupEmail = async (to, username, bookTitle) => {
  try {
    const htmlContent = `
      <p>Hello ${username},</p>
      <p>Great news! The book you requested, <strong>"${bookTitle}"</strong>, is now ready for pickup at the library front desk. 🎉</p>
      <div class="alert-card">
        <strong>Pickup Instructions:</strong>
        <p style="margin: 5px 0 0 0;">Please visit the library desk within <strong>3 working days</strong> to collect your book. Be sure to present your Student / Library Membership ID card to the desk officer.</p>
      </div>
      <p>If you fail to collect the book within 3 days, your reservation will automatically be cancelled.</p>
    `;
    const mailOptions = {
      from: `"Library System" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Book Ready for Pickup! - Library Management System',
      html: getEmailWrapper('Ready for Pickup', htmlContent),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Book ready-for-pickup email sent successfully to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[EmailService] Error sending book ready email to ${to}:`, error);
  }
};

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetOtpEmail,
  sendPasswordResetSuccessEmail,
  sendBookRequestedEmail,
  sendBookReadyForPickupEmail,
};
