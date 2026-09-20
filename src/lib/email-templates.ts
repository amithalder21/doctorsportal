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

export const getAppointmentReceivedEmail = (name: string, date: string, time: string, appointmentId: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #132573; margin: 0;">Ankit Gaur Clinic</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>We have successfully received your appointment request. Your request is currently <strong>Pending Confirmation</strong>.</p>
        
        <div style="background-color: #fcf8e3; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #faebcc;">
          <h3 style="margin-top: 0; color: #8a6d3b;">Appointment Request Details</h3>
          <p style="margin: 5px 0;"><strong>Request ID:</strong> ${appointmentId}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Pending Review</p>
        </div>

        <p>Our staff will review your request and you will receive another email once your appointment is confirmed.</p>
        
        <p>If you have any questions in the meantime, please contact our clinic.</p>
        
        <p style="margin-top: 30px;">Best Regards,<br/><strong>The Ankit Gaur Clinic Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Ankit Gaur Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getAppointmentConfirmedEmail = (name: string, date: string, time: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #132573; margin: 0;">Ankit Gaur Clinic</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Great news! Your appointment has been officially confirmed.</p>
        
        <div style="background-color: #E6F1F7; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #c2dbe9;">
          <h3 style="margin-top: 0; color: #132573;">Appointment Details</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
        </div>

        <p>Please arrive 10 minutes prior to your scheduled time. If you have any previous medical records or prescriptions, please remember to bring them with you.</p>
        
        <p>If you need to reschedule or have any questions, please contact our clinic.</p>
        
        <p style="margin-top: 30px;">Best Regards,<br/><strong>The Ankit Gaur Clinic Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Ankit Gaur Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getAppointmentCancelledEmail = (name: string, date: string, time: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #132573; margin: 0;">Ankit Gaur Clinic</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>We are writing to inform you that your appointment has been cancelled.</p>
        
        <div style="background-color: #fff0f0; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #FF8D8D;">
          <h3 style="margin-top: 0; color: #d32f2f;">Cancelled Appointment</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
        </div>

        <p>We apologize for any inconvenience this may cause. If you would like to book a new appointment, please visit our website.</p>
        
        <p style="margin-top: 30px;">Best Regards,<br/><strong>The Ankit Gaur Clinic Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Ankit Gaur Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getOtpEmail = (otp: string, role: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #132573; margin: 0;">Ankit Gaur Clinic</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6; text-align: center;">
        <p>Hello,</p>
        <p>You requested a One-Time Password (OTP) to securely log in as <strong>${role}</strong>.</p>
        
        <div style="background-color: #E6F1F7; padding: 30px; border-radius: 12px; margin: 30px 0; border: 1px solid #c2dbe9;">
          <p style="margin: 0; font-size: 14px; color: #132573; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
          <h2 style="margin: 10px 0 0 0; font-size: 36px; color: #132573; letter-spacing: 4px;">${otp}</h2>
        </div>

        <p style="font-size: 14px; color: #6b7280;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Ankit Gaur Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getAppointmentCompletedEmail = (name: string, date: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #132573; margin: 0;">Ankit Gaur Clinic</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for visiting Ankit Gaur Clinic on <strong>${date}</strong>. We hope you had a comfortable and satisfactory experience.</p>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #c8e6c9;">
          <h3 style="margin-top: 0; color: #2e7d32;">Post-Consultation</h3>
          <p style="margin: 5px 0;">If you have any further questions about your prescription, or if you need to schedule a follow-up visit, please don't hesitate to reach out to us.</p>
        </div>

        <p>Your health and well-being are our top priority. We wish you a speedy recovery and excellent health!</p>
        
        <p style="margin-top: 30px;">Best Regards,<br/><strong>Dr. Ankit Gaur & The Ankit Gaur Clinic Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Ankit Gaur Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getPaymentReceiptEmail = (name: string, date: string, appointmentId: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #132573; margin: 0;">Ankit Gaur Clinic</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>This email is to confirm that we have successfully received your payment.</p>
        
        <div style="background-color: #E6F1F7; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #c2dbe9;">
          <h3 style="margin-top: 0; color: #132573;">Payment Confirmation</h3>
          <p style="margin: 5px 0;"><strong>Appointment Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Reference ID:</strong> ${appointmentId}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #2e7d32; font-weight: bold;">PAID</span></p>
        </div>

        <p>Thank you for choosing Ankit Gaur Clinic.</p>
        
        <p style="margin-top: 30px;">Best Regards,<br/><strong>The Ankit Gaur Clinic Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Ankit Gaur Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const getAppointmentRescheduledEmail = (name: string, date: string, time: string) => {
  return `
    <div style="${baseStyles}">
      <div style="${headerStyles}">
        <h1 style="color: #132573; margin: 0;">Ankit Gaur Clinic</h1>
      </div>
      <div style="font-size: 16px; line-height: 1.6;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your appointment has been successfully rescheduled.</p>
        
        <div style="background-color: #E6F1F7; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #c2dbe9;">
          <h3 style="margin-top: 0; color: #132573;">New Appointment Details</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">PENDING CONFIRMATION</span></p>
        </div>

        <p>Our staff will review the new requested slot and you will receive another email once your new time is confirmed.</p>
        
        <p>If you need further assistance, please contact our clinic.</p>
        
        <p style="margin-top: 30px;">Best Regards,<br/><strong>The Ankit Gaur Clinic Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Ankit Gaur Clinic. All rights reserved.</p>
      </div>
    </div>
  `;
};
