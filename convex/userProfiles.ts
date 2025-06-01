import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Try to get doctor profile first
    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (doctorProfile) {
      return { ...doctorProfile, role: "doctor" };
    }

    // If not a doctor, try to get patient profile
    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (patientProfile) {
      return { ...patientProfile, role: "patient" };
    }

    return null;
  },
});

export const updateUserProfile = mutation({
  args: {
    role: v.union(v.literal("doctor"), v.literal("patient")),
    fullName: v.string(),
    age: v.number(),
    sex: v.string(),
    phoneNumber: v.string(),
    languages: v.optional(v.array(v.string())),
    // Doctor-specific fields
    specialization: v.optional(v.string()),
    licenseNumber: v.optional(v.string()),
    bio: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("Starting updateUserProfile with args:", args); // Debug log
    const userId = await getAuthUserId(ctx);
    console.log("Auth User ID:", userId); // Debug log

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { role, ...profileData } = args;
    console.log("Role:", role); // Debug log
    console.log("Profile Data:", profileData); // Debug log

    const tableName = role === "doctor" ? "doctorProfiles" : "patientProfiles";
    console.log("Table Name:", tableName); // Debug log

    // Check if profile exists in either table
    const existingDoctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    console.log("Existing Doctor Profile:", existingDoctorProfile); // Debug log

    const existingPatientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    console.log("Existing Patient Profile:", existingPatientProfile); // Debug log

    // If user is switching roles, delete the old profile
    if (role === "doctor" && existingPatientProfile) {
      console.log("Deleting existing patient profile"); // Debug log
      await ctx.db.delete(existingPatientProfile._id);
    } else if (role === "patient" && existingDoctorProfile) {
      console.log("Deleting existing doctor profile"); // Debug log
      await ctx.db.delete(existingDoctorProfile._id);
    }

    // Update or create new profile
    if (role === "doctor" && existingDoctorProfile) {
      console.log("Updating existing doctor profile"); // Debug log
      await ctx.db.patch(existingDoctorProfile._id, profileData);
      return await ctx.db
        .query("doctorProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();
    } else if (role === "patient" && existingPatientProfile) {
      console.log("Updating existing patient profile"); // Debug log
      await ctx.db.patch(existingPatientProfile._id, profileData);
      return await ctx.db
        .query("patientProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();
    } else {
      console.log("Creating new profile"); // Debug log
      // Create new profile
      const insertData = {
        userId,
        ...profileData,
      };
      console.log("Inserting new profile with data:", insertData); // Debug log
      const newProfile = await ctx.db.insert(tableName, insertData);
      console.log("New profile created:", newProfile); // Debug log
      return await ctx.db.get(newProfile);
    }
  },
});

export const updateFullName = mutation({
  args: {
    fullName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Try to update doctor profile first
    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (doctorProfile) {
      await ctx.db.patch(doctorProfile._id, { fullName: args.fullName });
      return await ctx.db.get(doctorProfile._id);
    }

    // If not a doctor, try to update patient profile
    const patientProfile = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (patientProfile) {
      await ctx.db.patch(patientProfile._id, { fullName: args.fullName });
      return await ctx.db.get(patientProfile._id);
    }

    throw new Error("No profile found");
  },
});
