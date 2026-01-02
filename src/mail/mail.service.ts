import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { getEmailVerificationTemplate } from './templates/email-verification.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;

    if (!host || !user || !pass) {
      this.logger.warn(
        'Email transporter not initialized: EMAIL_HOST / EMAIL_USER / EMAIL_PASSWORD is missing',
      );
      return;
    }

    const isSecure = port === 465;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      requireTLS: !isSecure,
      auth: { user, pass },
      tls: { rejectUnauthorized: true },
    });

    this.logger.log(`Email transporter initialized: ${host}:${port} (secure: ${isSecure})`);
  }

  async sendEmailVerificationCode(email: string, code: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`Skipping email send (no transporter). Email=${email}, code=${code}`);
      return;
    }

    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    await this.transporter.sendMail({
      from: `"ML Verification" <${from}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: getEmailVerificationTemplate(code),
    });

    this.logger.log(`Verification email sent to: ${email}`);
  }
}