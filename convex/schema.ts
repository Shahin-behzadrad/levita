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
    profileImage: v.optional(v.string()), // URL or storage ID for profile image
    availabilitySettings: v.optional(
      v.object({
        defaultDuration: v.number(), // in minutes
        bufferTime: v.number(), // in minutes
        workingHours: v.array(
          v.object({
            dayOfWeek: v.number(), // 0-6 (Sunday-Saturday)
            startTime: v.string(), // HH:mm format
            endTime: v.string(), // HH:mm format
            isAvailable: v.boolean(),
          })
        ),
      })
    ),
  }).index("by_userId", ["userId"]),

  // Patients
  patientProfiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    age: v.number(),
    sex: v.string(),
    phoneNumber: v.string(),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()), // URL or storage ID for profile image
    // Health Analysis fields
    healthInput: v.optional(
      v.object({
        symptoms: v.string(),
        currentConditions: v.string(),
        healthStatus: v.string(),
        additionalInfo: v.string(),
        documents: v.array(
          v.object({
            storageId: v.string(),
            fileName: v.string(),
            fileType: v.string(),
            uploadedAt: v.number(),
          })
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
      })
    ),
    ocr: v.optional(
      v.object({
        ocrText: v.array(v.string()),
      })
    ),
    // AI Analysis fields
    aiAnalysis: v.optional(
      v.object({
        doctorReport: v.object({
          patientOverview: v.string(),
          clinicalConsiderations: v.string(),
          laboratoryFindings: v.object({
            Biochemistry: v.array(v.string()),
            Complete_Blood_Count: v.array(v.string()),
            Other: v.array(v.string()),
          }),
          differentialDiagnosis: v.array(v.string()),
          recommendations: v.array(v.string()),
          conclusion: v.string(),
        }),
        patientReport: v.object({
          summary: v.string(),
          testResults: v.string(),
          reassurance: v.string(),
          nextSteps: v.string(),
        }),
        disclaimer: v.string(),
      })
    ),
  }).index("by_userId", ["userId"]),

  consultations: defineTable({
    patientId: v.id("patientProfiles"),
    senderUserId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("completed")
    ),
    acceptedByDoctorId: v.optional(v.id("doctorProfiles")),
    consultationDateTime: v.optional(v.string()), // Format: YYYY-MM-DD HH:mm
    chatStarted: v.optional(v.boolean()),
    chatEnded: v.optional(v.boolean()),

    doctorReportPreview: v.optional(
      v.object({
        patientOverview: v.string(),
        clinicalConsiderations: v.string(),
        laboratoryFindings: v.object({
          Biochemistry: v.array(v.string()),
          Complete_Blood_Count: v.array(v.string()),
          Other: v.array(v.string()),
        }),
        differentialDiagnosis: v.array(v.string()),
        recommendations: v.array(v.string()),
        conclusion: v.string(),
      })
    ),

    createdAt: v.number(), // use Date.now()
  })
    .index("by_status", ["status"])
    .index("by_patientId", ["patientId"]),

  chatMessages: defineTable({
    consultationId: v.id("consultations"),
    senderId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_consultation", ["consultationId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
