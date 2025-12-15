import nodemailer from "nodemailer";

const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // your email
      pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
    },
  });

const sendUserLoginEmail = async (email, metaInfoUser, oneTimePassword) => {
  const transporter = getTransporter();
  const url = `${`${process.env.FRONTEND_URL}/${
    metaInfoUser?.tenant_id
  }/login?${new URLSearchParams({
    email: metaInfoUser?.email,
  })?.toString()}`}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Set Your DaiL Password</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #000000; border-radius: 8px; overflow: hidden;">
                    <!-- Header with Logo -->
                    <tr>
                        <td style="text-align: center; padding: 40px 20px 20px;">
                            <h1 style="margin: 0; color: #7b7bf7; font-size: 48px; font-weight: 700; letter-spacing: -2px; font-family: 'Figtree', sans-serif;">DaiL</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <h2 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0 0 20px; text-align: center; font-family: 'Figtree', sans-serif;">Hi ${metaInfoUser?.first_name}, Welcome to DaiL!</h2>
                            
                            <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 30px; text-align: center; font-family: 'Figtree', sans-serif;">
                                We're excited to have you onboard. Just one more step, click the button below to create your password and start exploring the platform.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${url}" style="display: inline-block; background-color: #7b7bf7; color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; text-align: center; font-family: 'Figtree', sans-serif;">
                                            Set My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                             
                            <!-- One-Time Code Section -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="color: #cccccc; font-size: 14px; margin: 0 0 10px; font-family: 'Figtree', sans-serif;">Use this one-time password:</p>
                                        <div style="background-color: #1a1a1a; border: 2px solid #7b7bf7; border-radius: 8px; padding: 20px; display: inline-block; margin: 0 auto;">
                                            <span style="color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${oneTimePassword}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            
                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center; font-family: 'Figtree', sans-serif;">
                                This link will expire in 24 hours for security purposes.
                            </p>
                            
                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0; text-align: center; font-family: 'Figtree', sans-serif;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <span style="color: #7b7bf7; word-break: break-all;">${url}</span>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px; text-align: center; border-top: 1px solid #333333;">
                            <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 15px; font-family: 'Figtree', sans-serif;">
                                An AI Sales Coaching roleplaying platform designed to train, diagnose, and inspire.
                            </p>
                            
                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 15px 0 0; font-family: 'Figtree', sans-serif;">
                                Need help? Our support team is always happy to assist at<br>
                                <a href="mailto:support@hellodail.com" style="color: #7b7bf7; text-decoration: none; font-family: 'Figtree', sans-serif;">support@hellodail.com</a>
                            </p>
                            
                            <p style="color: #666666; font-size: 12px; line-height: 1.6; margin: 20px 0 0; font-family: 'Figtree', sans-serif;">
                                Wyomind address
                            </p>
                            
                            <p style="color: #666666; font-size: 12px; line-height: 1.6; margin: 10px 0 0; font-family: 'Figtree', sans-serif;">
                                © 2025 DaiL. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Email Client Compatibility Note -->
                <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                    <tr>
                        <td style="text-align: center; color: #666666; font-size: 12px; line-height: 1.4; padding: 0 20px; font-family: 'Figtree', sans-serif;">
                            You're receiving this email because you signed up for DaiL.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  // Setup email data
  const mailOptions = {
    from: "Dail@hellodail.com",
    to: email,
    subject: "Let's begin your journey!",
    text: `Your account has been created.`,
    html: htmlContent,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

const sendPasswordResetEmail = async (email, metaInfoUser, resetToken) => {
  const transporter = getTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/${
    metaInfoUser?.tenant_id
  }/resetPassword?${new URLSearchParams({
    resetSessionToken: resetToken,
    email: metaInfoUser?.email,
  })?.toString()}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your DaiL Password</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #000000; border-radius: 8px; overflow: hidden;">
                    <!-- Header with Logo -->
                    <tr>
                        <td style="text-align: center; padding: 40px 20px 20px;">
                            <h1 style="margin: 0; color: #7b7bf7; font-size: 48px; font-weight: 700; letter-spacing: -2px; font-family: 'Figtree', sans-serif;">DaiL</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <h2 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0 0 20px; text-align: center; font-family: 'Figtree', sans-serif;">Reset your password</h2>
                            
                            <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 30px; text-align: center; font-family: 'Figtree', sans-serif;">
                                Hi ${metaInfoUser?.first_name}, We received a request to reset your password. Click the button below to create a new password for your account.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${resetUrl}" style="display: inline-block; background-color: #7b7bf7; color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; text-align: center; font-family: 'Figtree', sans-serif;">
                                            Set My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center; font-family: 'Figtree', sans-serif;">
                                This link will expire in 24 hours for security purposes.
                            </p>
                            
                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0; text-align: center; font-family: 'Figtree', sans-serif;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                            
                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0; text-align: center; font-family: 'Figtree', sans-serif;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <span style="color: #7b7bf7; word-break: break-all;">${resetUrl}</span>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px; text-align: center; border-top: 1px solid #333333;">
                            <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 15px; font-family: 'Figtree', sans-serif;">
                                If you need any help along the way, our support team is always happy to assist at
                            </p>
                            
                            <p style="color: #7b7bf7; font-size: 14px; line-height: 1.6; margin: 0; font-family: 'Figtree', sans-serif;">
                                <a href="mailto:support@hellodail.com" style="color: #7b7bf7; text-decoration: none; font-family: 'Figtree', sans-serif;">support@hellodail.com</a>
                            </p>
                            
                            <p style="color: #666666; font-size: 12px; line-height: 1.6; margin: 30px 0 0; font-family: 'Figtree', sans-serif;">
                                An AI Sales Coaching roleplaying platform designed to train, diagnose, and inspire.
                            </p>
                            
                            <p style="color: #666666; font-size: 12px; line-height: 1.6; margin: 20px 0 0; font-family: 'Figtree', sans-serif;">
                                Wyomind address
                            </p>
                            
                            <p style="color: #666666; font-size: 12px; line-height: 1.6; margin: 10px 0 0; font-family: 'Figtree', sans-serif;">
                                © 2025 DaiL. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Email Client Compatibility Note -->
                <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                    <tr>
                        <td style="text-align: center; color: #666666; font-size: 12px; line-height: 1.4; padding: 0 20px; font-family: 'Figtree', sans-serif;">
                            You're receiving this email because a password reset was requested for your DaiL account.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  // Setup email data
  const mailOptions = {
    from: "Dail@hellodail.com",
    to: email,
    subject: "Reset your password",
    text: `Click the link to reset your password: ${resetUrl}`,
    html: htmlContent,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log("Preview URL RESET:", nodemailer.getTestMessageUrl(info));
};

export const EMAIL_SERVICE = { sendUserLoginEmail, sendPasswordResetEmail };
