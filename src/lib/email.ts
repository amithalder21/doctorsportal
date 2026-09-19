import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  return await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Ankit\'s Doctor Portel" <noreply@ankitgaur.justbots.tech>',
    to,
    subject,
    html,
  });
};
