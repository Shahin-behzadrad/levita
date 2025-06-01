import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Doctors
  doctorProfiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    age: v.number(),
    sex: v.string(), // e.g., "male", "female", "other"
    specialization: v.string(),
    licenseNumber: v.string(),
    phoneNumber: v.string(), // used to generate WhatsApp link
    languages: v.optional(v.array(v.string())),
    bio: v.optional(v.string()), // subtext: "Share anything you're particularly passionate about, in regards to healthcare and not"
  }).index("by_userId", ["userId"]),

  // Patients
  patientProfiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    age: v.number(),
    sex: v.string(),
    phoneNumber: v.string(),
    languages: v.optional(v.array(v.string())),
  }).index("by_userId", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
