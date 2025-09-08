// lib/email/service.ts
import nodemailer from "nodemailer";

// Utility function to get current year for email footers
const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    address: string;
  };
}

// Email options interface
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create email configuration
const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  from: {
    name: process.env.SMTP_FROM_NAME || "Restaurant Platform",
    address: process.env.SMTP_FROM_EMAIL!,
  },
};

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);
  }
  return transporter;
};

// Verify email configuration (optional - use for testing)
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transport = getTransporter();
    if (!transport) {
      throw new Error("Failed to create email transporter");
    }
    await transport.verify();
    console.log("✅ Email configuration verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email configuration verification failed:", error);
    return false;
  }
};

// Send email function
export const sendEmail = async (
  options: EmailOptions
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate required environment variables
    const requiredVars = ["SMTP_USER", "SMTP_PASS", "SMTP_FROM_EMAIL"];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }

    const transport = getTransporter();

    if (!transport) {
      throw new Error("Failed to create email transporter");
    }

    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.address}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || "", // Fallback plain text
    };

    const info = await transport.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Registration approval email
export const sendApprovalEmail = async (
  email: string,
  businessName: string
): Promise<{ success: boolean; error?: string }> => {
  const subject = `🎉 Registration Approved - Welcome to ${
    process.env.APP_NAME || "Restaurant Platform"
  }!`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Approved</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎉 Welcome Aboard!</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your registration has been approved</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Hello ${businessName}!</h2>
          
          <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            Congratulations! Your registration for <strong>${businessName}</strong> has been approved by our admin team. 
            You can now access all platform features and start managing your restaurant.
          </p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
            <ul style="color: #166534; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Log in to your account to get started</li>
              <li style="margin-bottom: 8px;">Complete your restaurant profile setup</li>
              <li style="margin-bottom: 8px;">Upload your menu and start taking orders</li>
              <li>Explore all the platform features</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
               style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
              Access Your Account
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
            If you have any questions or need assistance, please don't hesitate to contact our support team at 
            <a href="mailto:${
              process.env.SUPPORT_EMAIL
            }" style="color: #10b981;">${process.env.SUPPORT_EMAIL}</a>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© ${getCurrentYear()} ${
    process.env.APP_NAME || "Restaurant Platform"
  }. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This email was sent because your registration was approved by our admin team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Registration Approved - ${businessName}
    
    Congratulations! Your registration for ${businessName} has been approved.
    
    You can now log in to your account at: ${
      process.env.NEXT_PUBLIC_APP_URL
    }/login
    
    What's next:
    - Log in to your account
    - Complete your restaurant profile setup
    - Upload your menu and start taking orders
    
    If you need help, contact us at: ${process.env.SUPPORT_EMAIL}
    
    © ${getCurrentYear()} ${process.env.APP_NAME || "Restaurant Platform"}
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
};

// Registration rejection email
export const sendRejectionEmail = async (
  email: string,
  businessName: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> => {
  const subject = `Registration Status Update - ${
    process.env.APP_NAME || "Restaurant Platform"
  }`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Registration Update</h1>
          <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Regarding your application</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Hello ${businessName},</h2>
          
          <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            We appreciate your interest in joining our platform. After careful review, we're unable to approve your registration at this time.
          </p>
          
          ${
            reason
              ? `
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">Reason:</h3>
            <p style="color: #7f1d1d; margin: 0; line-height: 1.6;">${reason}</p>
          </div>
          `
              : ""
          }
          
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 18px;">What You Can Do:</h3>
            <ul style="color: #0369a1; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Review our registration requirements</li>
              <li style="margin-bottom: 8px;">Update your business documentation if needed</li>
              <li style="margin-bottom: 8px;">Resubmit your application with correct information</li>
              <li>Contact our support team if you have questions</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/signup" 
               style="background: #0369a1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
              Apply Again
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
            If you believe this was an error or have questions about your application, please contact our support team at 
            <a href="mailto:${
              process.env.SUPPORT_EMAIL
            }" style="color: #0369a1;">${process.env.SUPPORT_EMAIL}</a>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© ${getCurrentYear()} ${
    process.env.APP_NAME || "Restaurant Platform"
  }. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This email was sent regarding your registration application.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Registration Update - ${businessName}
    
    Thank you for your interest in joining our platform. We're unable to approve your registration at this time.
    
    ${reason ? `Reason: ${reason}` : ""}
    
    What you can do:
    - Review our registration requirements
    - Update your business documentation if needed
    - Resubmit your application
    - Contact support if you have questions
    
    Apply again at: ${process.env.NEXT_PUBLIC_APP_URL}/signup
    Support: ${process.env.SUPPORT_EMAIL}
    
    © ${getCurrentYear()} ${process.env.APP_NAME || "Restaurant Platform"}
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
};
