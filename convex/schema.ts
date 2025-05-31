import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("doctor"), v.literal("patient")),
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    sex: v.optional(v.string()), // e.g., "male", "female", "other"
    // Patient-specific fields
    symptoms: v.optional(v.array(v.string())),
    generalHealthStatus: v.optional(v.string()), // e.g., "good", "fair", "poor"
    // Doctor-specific fields
    specialization: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  labResults: defineTable({
    userId: v.id("users"),
    fileName: v.string(),
    storageId: v.id("_storage"),
    analysisId: v.optional(v.id("healthAnalyses")), // Link to analysis result
  }).index("by_userId", ["userId"]),

  healthAnalyses: defineTable({
    userId: v.id("users"),
    labResultIds: v.optional(v.array(v.id("labResults"))), // Array of lab result IDs
    userProfileAtAnalysis: v.object({
      // Snapshot of profile when analysis was run
      age: v.optional(v.number()),
      sex: v.optional(v.string()),
      symptoms: v.optional(v.array(v.string())),
      generalHealthStatus: v.optional(v.string()),
    }),
    potentialIssues: v.optional(v.array(v.string())),
    recommendedSpecialty: v.optional(v.string()),
    supplementSuggestions: v.optional(v.array(v.string())),
    rawAnalysis: v.optional(v.string()), // Store the full AI response if needed
  }).index("by_userId", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
