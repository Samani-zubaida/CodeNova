require('dotenv').config();
const { Resend } = require('resend');
const nodemailer = require('nodemailer');

const getEmailFrom = () => process.env.EMAIL_FROM || 'CodeNova <onboarding@resend.dev>';
const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

function getResendClient() {
  const key = process.env.RESEND_API_KEY || process.env.EMAIL_SERVICE_API_KEY;
  if (key && key !== 're_your_api_key_here') {
    return new Resend(key);
  }
  return null;
}

function getSmtpTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
}

/**
 * Base email layout wrapper matching CodeNova's dark visual aesthetic
 */
function getEmailHtmlWrapper({ title, preheader, contentHtml }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0a0a0c;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #F4EBC3;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0a0a0c;
      padding: 40px 0;
    }
    .main-table {
      margin: 0 auto;
      width: 100%;
      max-width: 580px;
      border-spacing: 0;
      background-color: #131118;
      border: 1px solid rgba(188, 162, 151, 0.25);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    }
    .accent-bar {
      height: 4px;
      background: linear-gradient(90deg, #AB526B 0%, #F4EBC3 50%, #7928CA 100%);
    }
    .header {
      padding: 32px 36px 20px;
      text-align: center;
    }
    .brand {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #FFFFFF;
      text-transform: uppercase;
      margin: 0;
    }
    .tagline {
      font-size: 12px;
      color: #C5CEAE;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .content {
      padding: 10px 36px 36px;
      font-size: 15px;
      line-height: 1.6;
      color: #E2E8F0;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #AB526B 0%, #7928CA 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 36px;
      border-radius: 12px;
      letter-spacing: 0.5px;
      box-shadow: 0 6px 20px rgba(171, 82, 107, 0.4);
    }
    .footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 24px 36px;
      text-align: center;
      font-size: 12px;
      color: #8E8A99;
      line-height: 1.5;
    }
    .url-box {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px;
      word-break: break-all;
      font-size: 12px;
      color: #C5CEAE;
      font-family: monospace;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <span style="display:none;font-size:1px;color:#0a0a0c;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>
  <div class="wrapper">
    <table class="main-table" role="presentation">
      <tr><td class="accent-bar"></td></tr>
      <tr>
        <td class="header">
          <div class="brand">CodeNova</div>
          <div class="tagline">Developer Multiverse</div>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${contentHtml}
        </td>
      </tr>
      <tr>
        <td class="footer">
          You received this message because an account action was requested for your email on CodeNova.<br>
          If this wasn't you, you can safely ignore this message.
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;
}

/**
 * Dispatch an email through Resend API or SMTP transporter
 */
async function sendMail({ to, subject, html, text }) {
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    throw new Error(`[EmailService] Invalid recipient email: ${to}`);
  }

  const resend = getResendClient();
  const smtp = getSmtpTransporter();
  const emailFrom = getEmailFrom();

  // 1. Resend API
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: emailFrom,
        to: to.trim().toLowerCase(),
        subject,
        html,
        text
      });

      if (response.error) {
        throw new Error(response.error.message || 'Resend delivery failed');
      }

      console.log(`[EmailService] Real email dispatched via Resend to ${to} (ID: ${response.data?.id})`);
      return { success: true, provider: 'resend', id: response.data?.id };
    } catch (err) {
      console.error('[EmailService] Resend dispatch error:', err.message);
      if (err.message && err.message.includes('only send testing emails to your own email address')) {
        console.warn(`[EmailService] Resend free-tier sandbox note: to send to external recipients, verify domain at resend.com. Logged dispatch for: ${to}`);
        return { success: true, provider: 'resend-sandbox-fallback', note: err.message };
      }
      // If SMTP configured, try fallback
      if (!smtp) {
        throw err;
      }
    }
  }

  // 2. SMTP Transporter fallback
  if (smtp) {
    try {
      const info = await smtp.sendMail({
        from: emailFrom,
        to: to.trim().toLowerCase(),
        subject,
        html,
        text
      });
      console.log(`[EmailService] Real email dispatched via SMTP to ${to} (ID: ${info.messageId})`);
      return { success: true, provider: 'smtp', id: info.messageId };
    } catch (smtpErr) {
      console.error('[EmailService] SMTP dispatch error:', smtpErr.message);
      throw smtpErr;
    }
  }

  // 3. Fallback: Log email details to console in development
  console.log(`[EmailService DEV LOG] Email to: ${to} | Subject: ${subject}`);
  return { success: true, provider: 'console-dev' };
}

const emailService = {
  /**
   * Send Email Verification Link
   */
  sendVerificationEmail: async ({ to, username, verificationLink }) => {
    const subject = 'Verify your CodeNova account';
    const preheader = `Verify your developer identity on CodeNova: ${username}`;

    const contentHtml = `
      <h2 style="color: #FFFFFF; font-size: 20px; margin-top: 0;">Welcome to CodeNova, ${username}!</h2>
      <p>Thank you for creating your developer handle. To activate your account and start exploring the 3D algorithm universe, please verify your email address.</p>
      
      <div class="btn-container">
        <a href="${verificationLink}" class="btn" target="_blank">Verify My Email</a>
      </div>

      <p style="font-size: 13px; color: #BCA297;">
        This verification link will expire in <strong>24 hours</strong>. If you did not register for CodeNova, no further action is needed.
      </p>

      <p style="font-size: 12px; color: #8E8A99; margin-top: 24px;">
        Button not working? Copy and paste this exact link into your browser:
      </p>
      <div class="url-box">${verificationLink}</div>
    `;

    const text = `Welcome to CodeNova, ${username}!\n\nPlease verify your email by clicking the link below:\n${verificationLink}\n\nThis link is valid for 24 hours.`;

    const html = getEmailHtmlWrapper({
      title: subject,
      preheader,
      contentHtml
    });

    return sendMail({ to, subject, html, text });
  },

  /**
   * Send Welcome Email post-verification
   */
  sendWelcomeEmail: async ({ to, username }) => {
    const subject = 'Welcome to CodeNova - Your identity is verified!';
    const preheader = `Your CodeNova developer account has been activated.`;
    const gameLink = `${FRONTEND_URL}/game`;

    const contentHtml = `
      <h2 style="color: #FFFFFF; font-size: 20px; margin-top: 0;">You're Verified, ${username}! 🚀</h2>
      <p>Your CodeNova developer account has been fully verified and activated. You now have complete access to:</p>
      
      <ul style="padding-left: 20px; color: #F4EBC3; line-height: 1.8;">
        <li><strong>Interactive 3D Algorithm Multiverse:</strong> Explore Data Structures and Algorithms with real-time physics.</li>
        <li><strong>Live Code Sandbox:</strong> Compile, benchmark, and visualize Python, Java, C++, and JavaScript.</li>
        <li><strong>Real-time Code Duels:</strong> Challenge developers worldwide in multiplayer algorithmic arenas.</li>
        <li><strong>Gamified Progression:</strong> Earn XP, climb the leaderboards, and collect prestige badges.</li>
      </ul>

      <div class="btn-container">
        <a href="${gameLink}" class="btn" target="_blank">Enter CodeNova World</a>
      </div>

      <p style="font-size: 13px; color: #BCA297;">
        Ready to level up your engineering skills? Jump into the multiverse now!
      </p>
    `;

    const text = `Welcome to CodeNova, ${username}!\n\nYour developer identity is verified. Enter the 3D multiverse now:\n${gameLink}`;

    const html = getEmailHtmlWrapper({
      title: subject,
      preheader,
      contentHtml
    });

    return sendMail({ to, subject, html, text });
  },

  /**
   * Send Account/Notification Email
   */
  sendAccountNotificationEmail: async ({ to, username, title, message, actionUrl, actionText }) => {
    const subject = `CodeNova: ${title}`;
    const preheader = `${title} for ${username}`;
    const targetUrl = actionUrl || `${FRONTEND_URL}/game`;
    const targetText = actionText || 'View in CodeNova';

    const contentHtml = `
      <h2 style="color: #FFFFFF; font-size: 20px; margin-top: 0;">${title}</h2>
      <p style="color: #E2E8F0;">Hey <strong>${username}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6; color: #F4EBC3;">${message}</p>
      
      <div class="btn-container">
        <a href="${targetUrl}" class="btn" target="_blank">${targetText}</a>
      </div>
    `;

    const text = `Hey ${username},\n\n${title}\n\n${message}\n\n${targetUrl}`;

    const html = getEmailHtmlWrapper({
      title: subject,
      preheader,
      contentHtml
    });

    return sendMail({ to, subject, html, text });
  }
};

module.exports = emailService;
