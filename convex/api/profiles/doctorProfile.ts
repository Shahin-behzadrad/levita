import { v } from "convex/values";
import { Id } from "../../_generated/dataModel";
import { query } from "../../_generated/server";

export const getDoctorProfileById = query({
  args: v.object({
    doctorId: v.string(),
  }),
  handler: async (ctx, args) => {
    const { doctorId } = args;

    const profile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_id", (q) => q.eq("_id", doctorId as Id<"doctorProfiles">))
      .unique();

    if (!profile) {
      return null;
    }

    let imageUrl = null;
    if (profile.profileImage) {
      imageUrl = await ctx.storage.getUrl(
        profile.profileImage as Id<"_storage">
      );
    }

    return { ...profile, profileImage: imageUrl };
  },
});
