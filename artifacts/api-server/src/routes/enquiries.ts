import { Router, type IRouter } from "express";
import { db, enquiriesTable, insertEnquirySchema } from "@workspace/db";
import { desc } from "drizzle-orm";
import { sendEnquiryEmails } from "../lib/email";

const router: IRouter = Router();

router.get("/enquiries", async (req, res) => {
  try {
    const enquiries = await db
      .select()
      .from(enquiriesTable)
      .orderBy(desc(enquiriesTable.createdAt));
    res.json(enquiries);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch enquiries");
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

router.post("/enquiries", async (req, res) => {
  const parsed = insertEnquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [enquiry] = await db
      .insert(enquiriesTable)
      .values(parsed.data)
      .returning();

    // Send emails in background — don't block the response
    sendEnquiryEmails({
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      boardClass: enquiry.boardClass,
      subject: enquiry.subject,
      location: enquiry.location,
      message: enquiry.message,
      createdAt: enquiry.createdAt,
    }).catch((err) => {
      req.log.error({ err }, "Email sending failed");
    });

    res.status(201).json(enquiry);
  } catch (err) {
    req.log.error({ err }, "Failed to create enquiry");
    res.status(500).json({ error: "Failed to create enquiry" });
  }
});

export default router;
