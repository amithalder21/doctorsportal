const baseStyles = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  color: #333333;
`;

const headerStyles = `
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 20px;
`;

const footerStyles = `
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
  margin-top: 30px;
  font-size: 12px;
  color: #9ca3af;
`;

const buttonStyles = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #ff6b6b;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  border-radius: 8px;
  margin-top: 20px;
`;

export const getAppointmentConfirmedEmail = (name: string, date: string, time: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #ff6b6b; margin: 0;">Salute Care</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Great news! Your appointment has been officially confirmed.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
          <h3 style="margin-top: 0; color: #111827;">Appointment Details</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
        </div>

        <p>Please arrive 10 minutes prior to your scheduled time. If you have any previous medical records or prescriptions, please remember to bring them with you.</p>
        
        <p>If you need to reschedule or have any questions, please contact our clinic.</p>
        
        <p style="margin-top: 30px;">Best Regards,<br/><strong>The Salute Care Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Salute Care Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getAppointmentCancelledEmail = (name: string, date: string, time: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #ff6b6b; margin: 0;">Salute Care</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>We are writing to inform you that your appointment has been cancelled.</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #fee2e2;">
          <h3 style="margin-top: 0; color: #991b1b;">Cancelled Appointment</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
        </div>

        <p>We apologize for any inconvenience this may cause. If you would like to book a new appointment, please visit our website.</p>
        
        <p style="margin-top: 30px;">Best Regards,<br/><strong>The Salute Care Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Salute Care Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getOtpEmail = (otp: string, role: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #ff6b6b; margin: 0;">Salute Care</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6; text-align: center;">
        <p>Hello,</p>
        <p>You requested a One-Time Password (OTP) to securely log in as <strong>${role}</strong>.</p>
        
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 12px; margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
          <h2 style="margin: 10px 0 0 0; font-size: 36px; color: #111827; letter-spacing: 4px;">${otp}</h2>
        </div>

        <p style="font-size: 14px; color: #6b7280;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Salute Care Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};
