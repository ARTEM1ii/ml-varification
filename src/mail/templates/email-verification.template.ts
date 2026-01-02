export function getEmailVerificationTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #292929; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #03A05E; color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 10px 10px; }
            .code { font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 12px 16px; background: #fff; border-radius: 8px; display: inline-block; }
            .footer { text-align: center; margin-top: 16px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>Your verification code:</p>
              <p class="code">${code}</p>
              <p>This code will expire soon. If you didn’t request it — ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ML Verification</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }