import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        } as SMTPTransport.Options);
        // Verify connection configuration
        this.verifyConnection();
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('SMTP connection verified successfully');
        } catch (error) {
            console.error('SMTP connection failed', error.stack);
        }
    }

    async sendVerificationEmail(email: string, token: string) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}}`;

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Email Verification - Ecommerce platform',
            html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p>Thank you for registering with our Ecommerce platform!</p>
          <p>Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This verification link will expire in 24 hours. If you didn't create an account, 
            please ignore this email.
          </p>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeEmail(email: string, fullName: string) {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Welcome to Ecommerce Platform!',
            html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Welcome ${fullName}!</h2>
          <p>Your email has been successfully verified. Welcome to our Ecommerce platform!</p>
          <p>You can now:</p>
          <ul>
            <li>Browse available Products</li>
            <li>buy featured products</li>
            <li>Browse your orders history</li>
            <li>Leave reviews and ratings</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/" 
               style="background-color: #28a745; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Thank you for choosing our platform!
          </p>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error: error.message };
        }
    }
}
