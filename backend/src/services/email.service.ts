import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  public static getTransporter(): nodemailer.Transporter {
    if (this.transporter) return this.transporter;

    const user = (process.env.EMAIL_USER || process.env.SMTP_USER || 'careerengine460@gmail.com').trim();
    const rawPass = process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASS;

    if (rawPass && rawPass.trim().length > 0) {
      // Remove all spaces Google App Passwords display by default (e.g. "abcd efgh ijkl mnop" -> "abcdefghijklmnop")
      const cleanPass = rawPass.replace(/\s+/g, '').trim();

      // Direct SSL/TLS Port 465 transport (Most reliable for cloud hosts like Render)
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user,
          pass: cleanPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
    } else {
      // Local development fallback stream transport
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'windows',
      });
    }

    return this.transporter;
  }

  public static async verifyConnection(): Promise<boolean> {
    try {
      const pass = process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASS;
      if (!pass) {
        console.log('[EmailService] EMAIL_APP_PASSWORD not set in environment. Running in fallback mode.');
        return true;
      }
      const transporter = this.getTransporter();
      await transporter.verify();
      console.log('✅ [EmailService] Gmail SMTP connected successfully and verified!');
      return true;
    } catch (err: any) {
      console.error('❌ [EmailService] Gmail SMTP connection failed:', err.message);
      return false;
    }
  }

  public static async sendPasswordResetOTP(toEmail: string, otp: string): Promise<boolean> {
    console.log(`====================================================`);
    console.log(`🔑 [EmailService] Password Reset OTP for ${toEmail}: [ ${otp} ]`);
    console.log(`====================================================`);

    try {
      const transporter = this.getTransporter();
      const user = process.env.EMAIL_USER || process.env.SMTP_USER || 'careerengine460@gmail.com';
      const from = `Career Engine AI <${user}>`;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 0; background-color: #050608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
            .container { max-width: 560px; margin: 30px auto; background-color: #0B1020; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px 32px; color: #F8FAFC; text-align: center; }
            .logo { font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 4px; }
            .tag { font-size: 11px; font-family: monospace; color: #3B82F6; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
            .title { font-size: 24px; font-weight: 800; color: #FFFFFF; margin: 16px 0 8px 0; }
            .desc { font-size: 14px; color: #8D96AA; line-height: 1.6; margin-bottom: 28px; }
            .otp-box { background: rgba(255, 255, 255, 0.03); border: 1px dashed rgba(59, 130, 246, 0.4); border-radius: 16px; padding: 24px; margin: 24px 0; }
            .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #10B981; font-family: monospace; }
            .expiry { font-size: 12px; color: #8D96AA; margin-top: 12px; }
            .security-note { font-size: 12px; color: #64748B; line-height: 1.5; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 20px; margin-top: 28px; }
            .footer { font-size: 11px; color: #475569; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Career Engine AI</div>
            <div class="tag">CAREER INTELLIGENCE</div>
            
            <h1 class="title">Password Reset Request</h1>
            <p class="desc">
              We received a request to reset your Career Engine AI password for <strong>${toEmail}</strong>.<br>
              Use the verification code below to complete your identity verification.
            </p>
            
            <div class="otp-box">
              <div style="font-size: 11px; color: #8D96AA; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div class="expiry">⏱ This code will expire in <strong>10 minutes</strong>.</div>
            </div>
            
            <div class="security-note">
              <strong>Security Notice:</strong> If you did not request a password reset, you can safely ignore this email. Never share this OTP with anyone.
            </div>
            
            <div class="footer">
              &copy; ${new Date().getFullYear()} Career Engine AI Inc. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;

      const sendPromise = transporter.sendMail({
        from,
        to: toEmail,
        subject: 'Career Engine AI — Your Password Reset OTP',
        text: `Career Engine AI Password Reset OTP: ${otp}. This code expires in 10 minutes. If you did not request this, please ignore this email.`,
        html,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email dispatch timed out after 6 seconds')), 6000)
      );

      await Promise.race([sendPromise, timeoutPromise]);
      console.log(`[EmailService] Password reset OTP successfully dispatched to ${toEmail}`);
      return true;
    } catch (err: any) {
      console.error('[EmailService] Failed or timed out dispatching email:', err.message);
      return false;
    }
  }
}
