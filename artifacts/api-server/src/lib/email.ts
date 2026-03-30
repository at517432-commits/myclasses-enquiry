import { Resend } from "resend";
import { logger } from "./logger";

const ADMIN_EMAIL = "at4340985@gmail.com";
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

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f97316; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Demo Class Request</h1>
        <p style="color: #fff3e0; margin: 5px 0 0; font-size: 14px;">MyClasses — New Enquiry Received</p>
      </div>
      <div style="background: #fff8f0; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #fed7aa;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold; width: 140px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Board &amp; Class</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.boardClass}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Subject</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Location</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.location}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #92400e; font-weight: bold;">Message</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #fed7aa; color: #1c1917;">${data.message || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #92400e; font-weight: bold;">Date</td>
            <td style="padding: 10px 0; color: #1c1917;">${formattedDate}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 12px; background: #fff; border-left: 4px solid #f97316; border-radius: 4px;">
          <p style="margin: 0; color: #78350f; font-size: 13px;">Please contact this student within 24 hours to schedule their free demo class.</p>
        </div>
      </div>
      <p style="color: #a8a29e; font-size: 12px; text-align: center; margin-top: 16px;">MyClasses — Home Tuition Enquiry System</p>
    </div>
  `;

  const studentHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f97316; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">MyClasses</h1>
        <p style="color: #fff3e0; margin: 6px 0 0; font-size: 14px;">Home Tuition — Expert Tutors for Every Student</p>
      </div>
      <div style="background: #fff8f0; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #fed7aa; text-align: center;">
        <div style="width: 64px; height: 64px; background: #dcfce7; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 32px;">&#10003;</span>
        </div>
        <h2 style="color: #1c1917; font-size: 20px; margin: 0 0 12px;">Request Received!</h2>
        <p style="color: #57534e; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Dear <strong>${data.name}</strong>,
        </p>
        <div style="background: white; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; text-align: left; margin-bottom: 24px;">
          <p style="color: #57534e; font-size: 15px; line-height: 1.7; margin: 0;">
            Your free demo class request has been received. Our team will contact you within <strong>24 hours</strong> to schedule your demo class for <strong>${data.boardClass} — ${data.subject}</strong>.
          </p>
        </div>
        <p style="color: #78350f; font-size: 14px; margin: 0 0 8px;">In the meantime, if you have any questions, feel free to reach out.</p>
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
      subject: `New Demo Class Request — ${data.name} (${data.boardClass})`,
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
  }

  if (studentResult.status === "rejected") {
    logger.error({ err: studentResult.reason }, "Failed to send student confirmation email");
  } else if (studentResult.value.error) {
    logger.error({ err: studentResult.value.error }, "Resend error sending student email");
  }
}
