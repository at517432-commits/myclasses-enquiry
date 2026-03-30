import { Resend } from "resend";
import { logger } from "./logger";

const ADMIN_EMAIL = "at517432@gmail.com";
const FROM_EMAIL = "MyClasses <onboarding@resend.dev>";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

interface EnquiryEmailData {
  name: string;
  phone: string;
  email: string;
  boardClass: string;
  subject: string;
  location: string;
  message?: string | null;
  createdAt: Date;
}

export async function sendEnquiryEmails(data: EnquiryEmailData): Promise<void> {
  const client = getResend();

  const formattedDate = data.createdAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const messageLine = data.message ? data.message : "No message";

  // Plain text body exactly as requested
  const adminText = `New enquiry received!

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Board & Class: ${data.boardClass}
Subject: ${data.subject}
Location: ${data.location}
Message: ${messageLine}
Date: ${formattedDate}`;

  // HTML version with same content for better inbox delivery
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff8f0; border: 1px solid #fed7aa; border-radius: 8px;">
      <div style="background: #f97316; padding: 16px 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px;">
        <h2 style="color: white; margin: 0; font-size: 18px;">New Enquiry Received - MyClasses</h2>
      </div>
      <p style="color: #1c1917; font-size: 15px; margin: 0 0 20px;"><strong>New enquiry received!</strong></p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold; width: 130px;">Name</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Phone</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Email</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Board &amp; Class</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.boardClass}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Subject</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.subject}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Location</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.location}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Message</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${messageLine}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; color: #92400e; font-weight: bold;">Date</td>
          <td style="padding: 9px 0; color: #1c1917;">${formattedDate}</td>
        </tr>
      </table>
      <p style="color: #a8a29e; font-size: 11px; text-align: center; margin-top: 24px;">MyClasses — Home Tuition Enquiry System</p>
    </div>
  `;

  const studentHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f97316; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">MyClasses</h1>
        <p style="color: #fff3e0; margin: 6px 0 0; font-size: 14px;">Home Tuition — Expert Tutors for Every Student</p>
      </div>
      <div style="background: #fff8f0; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #fed7aa; text-align: center;">
        <h2 style="color: #1c1917; font-size: 20px; margin: 0 0 16px;">Request Received!</h2>
        <p style="color: #57534e; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
          Dear <strong>${data.name}</strong>,<br/><br/>
          Your free demo class request has been received. Our team will contact you within <strong>24 hours</strong> to schedule your demo class for <strong>${data.boardClass} — ${data.subject}</strong>.
        </p>
        <p style="color: #a8a29e; font-size: 13px; margin: 24px 0 0; padding-top: 20px; border-top: 1px solid #fed7aa;">
          — MyClasses Team
        </p>
      </div>
      <p style="color: #a8a29e; font-size: 12px; text-align: center; margin-top: 16px;">Copyright MyClasses 2025. All rights reserved.</p>
    </div>
  `;

  const [adminResult, studentResult] = await Promise.allSettled([
    client.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: "New Enquiry Received - MyClasses",
      text: adminText,
      html: adminHtml,
    }),
    client.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: "Your Free Demo Class Request is Confirmed — MyClasses",
      html: studentHtml,
    }),
  ]);

  if (adminResult.status === "rejected") {
    logger.error({ err: adminResult.reason }, "Failed to send admin notification email");
  } else if (adminResult.value.error) {
    logger.error({ err: adminResult.value.error }, "Resend error sending admin email");
  } else {
    logger.info({ id: adminResult.value.data?.id, to: ADMIN_EMAIL }, "Admin notification email sent");
  }

  if (studentResult.status === "rejected") {
    logger.error({ err: studentResult.reason }, "Failed to send student confirmation email");
  } else if (studentResult.value.error) {
    logger.error({ err: studentResult.value.error }, "Resend error sending student email");
  } else {
    logger.info({ id: studentResult.value.data?.id, to: data.email }, "Student confirmation email sent");
  }
}
