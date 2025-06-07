import { v } from "convex/values";
import { mutation, query } from "../../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get doctor's availability settings
export const getDoctorAvailability = query({
  args: {
    doctorId: v.id("doctorProfiles"),
  },
  handler: async (ctx, args) => {
    const doctor = await ctx.db.get(args.doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return doctor.availabilitySettings;
  },
});

// Update doctor's availability settings
export const updateDoctorAvailability = mutation({
  args: {
    defaultDuration: v.number(),
    bufferTime: v.number(),
    workingHours: v.array(
      v.object({
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
        isAvailable: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const doctorProfile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!doctorProfile) {
      throw new Error("Doctor profile not found");
    }

    await ctx.db.patch(doctorProfile._id, {
      availabilitySettings: args,
    });

    return await ctx.db.get(doctorProfile._id);
  },
});
