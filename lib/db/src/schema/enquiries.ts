import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  boardClass: text("board_class").notNull(),
  subject: text("subject").notNull(),
  location: text("location").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEnquirySchema = createInsertSchema(enquiriesTable)
  .omit({ id: true, createdAt: true })
  .extend({
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    email: z.email("Invalid email address"),
    name: z.string().min(1, "Name is required"),
    boardClass: z.string().min(1, "Board & Class is required"),
    subject: z.string().min(1, "Subject is required"),
    location: z.string().min(1, "Location is required"),
  });

export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiriesTable.$inferSelect;
