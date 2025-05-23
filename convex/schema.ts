import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    sex: v.optional(v.string()), // e.g., "male", "female", "other"
    symptoms: v.optional(v.array(v.string())),
    generalHealthStatus: v.optional(v.string()), // e.g., "good", "fair", "poor"
  }).index("by_userId", ["userId"]),

  labResults: defineTable({
    userId: v.id("users"),
    fileName: v.string(),
    storageId: v.id("_storage"),
    analysisId: v.optional(v.id("healthAnalyses")), // Link to analysis result
  }).index("by_userId", ["userId"]),

  healthAnalyses: defineTable({
    userId: v.id("users"),
    labResultId: v.optional(v.id("labResults")), // Optional if analysis is based only on profile
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
  })
    .index("by_userId", ["userId"])
    .index("by_labResultId", ["labResultId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
