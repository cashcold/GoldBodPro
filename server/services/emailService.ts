import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Helper to get fresh SMTP settings from environment or .env
export function getSmtpConfig() {
  let host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  let port = Number(process.env.SMTP_PORT || 587);
  let user = process.env.SMTP_USER || '';
  let pass = process.env.SMTP_PASS || '';
  let sender = process.env.SENDER_EMAIL || user || 'cashcold99@gmail.com';

  // Read from .env or .env.example if process.env variables are missing
  const candidatePaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.example')
  ];

  for (const envPath of candidatePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const hostMatch = content.match(/SMTP_HOST\s*=\s*([^\r\n]+)/);
        const portMatch = content.match(/SMTP_PORT\s*=\s*([^\r\n]+)/);
        const userMatch = content.match(/SMTP_USER\s*=\s*([^\r\n]+)/);
        const passMatch = content.match(/SMTP_PASS\s*=\s*([^\r\n]+)/);
        const senderMatch = content.match(/SENDER_EMAIL\s*=\s*([^\r\n]+)/);

        if (!process.env.SMTP_HOST && hostMatch && hostMatch[1]) host = hostMatch[1].trim();
        if (!process.env.SMTP_PORT && portMatch && portMatch[1]) port = Number(portMatch[1].trim());
        if (!process.env.SMTP_USER && userMatch && userMatch[1]) user = userMatch[1].trim();
        if (!process.env.SMTP_PASS && passMatch && passMatch[1]) pass = passMatch[1].trim();
        if (!process.env.SENDER_EMAIL && senderMatch && senderMatch[1]) sender = senderMatch[1].trim();
      }
    } catch (e) {
      console.warn('Note reading SMTP from .env:', e);
    }
  }

  return { host, port, user, pass, sender };
}

export function createSmtpTransporter() {
  const config = getSmtpConfig();

  if (!config.user || !config.pass) {
    console.warn('⚠️ SMTP credentials not fully configured in .env');
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for 587/25
    auth: {
      user: config.user,
      pass: config.pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * Sends a password reset email using the configured SMTP relay (Brevo)
 */
export async function sendPasswordResetEmail(
  toEmail: string, 
  resetCode: string, 
  userName?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createSmtpTransporter();

    const recipientName = userName || toEmail.split('@')[0];

    const mailOptions = {
      from: `"GoldBod Pro Security" <${config.sender}>`,
      to: toEmail,
      subject: `🔑 GoldBod Pro - Password Reset Code: ${resetCode}`,
      text: `Hello ${recipientName},\n\nYou recently requested to reset your password for your GoldBod Pro account.\n\nYour 6-digit verification code is: ${resetCode}\n\nThis code will expire in 15 minutes.\n\nIf you did not request this password reset, please ignore this email or contact support immediately.\n\nBest regards,\nGoldBod Pro Security Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090E18; color: #E2E8F0; margin: 0; padding: 20px; }
            .container { max-width: 540px; margin: 0 auto; background: #0F172A; border: 1px solid rgba(255, 215, 0, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #1E293B, #0F172A); padding: 24px; text-align: center; border-bottom: 1px solid rgba(255, 215, 0, 0.2); }
            .logo { font-size: 22px; font-weight: 900; color: #FFD700; letter-spacing: 1px; }
            .content { padding: 30px 24px; }
            .greeting { font-size: 16px; color: #F8FAFC; margin-bottom: 16px; }
            .text { font-size: 14px; color: #94A3B8; line-height: 1.6; margin-bottom: 20px; }
            .code-box { background: #090E18; border: 2px dashed #FFD700; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
            .code-label { font-size: 11px; text-transform: uppercase; color: #FFD700; letter-spacing: 1.5px; font-weight: bold; margin-bottom: 6px; }
            .code-value { font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #FFFFFF; font-family: monospace; }
            .warning { font-size: 12px; color: #64748B; margin-top: 20px; border-top: 1px solid #1E293B; padding-top: 16px; }
            .footer { background: #090E18; padding: 16px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid rgba(255, 215, 0, 0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚡ GOLDBOD PRO</div>
              <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">Security & Account Protection</div>
            </div>
            <div class="content">
              <div class="greeting">Hello, <strong>${recipientName}</strong></div>
              <div class="text">
                We received a request to reset the password for your GoldBod Pro account. Please use the one-time verification code below to complete your password reset.
              </div>
              <div class="code-box">
                <div class="code-label">Verification Code (Valid for 15 minutes)</div>
                <div class="code-value">${resetCode}</div>
              </div>
              <div class="text" style="font-size: 13px;">
                Enter this code in the password reset form to choose a new password.
              </div>
              <div class="warning">
                ⚠️ If you did not request a password reset, please ignore this email. Your current password will remain completely secure.
              </div>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} GoldBod Pro Investment & Mining Platform. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log(`📧 [SMTP] Attempting to send password reset email to ${toEmail} via ${config.host}:${config.port}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [SMTP] Password reset email successfully delivered to ${toEmail}. Message ID:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('❌ [SMTP Error] Failed to send password reset email:', err);
    return { success: false, error: err.message || String(err) };
  }
}
