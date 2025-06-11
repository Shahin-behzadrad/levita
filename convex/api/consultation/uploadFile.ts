import { v } from "convex/values";
import { action } from "../../_generated/server";
import { api } from "../../_generated/api";

export const uploadFile = action({
  args: {
    consultationId: v.id("consultations"),
    fileData: v.object({
      name: v.string(),
      type: v.string(),
      size: v.number(),
      arrayBuffer: v.bytes(),
    }),
  },
  handler: async (ctx, args): Promise<string> => {
    const { consultationId, fileData } = args;

    // Generate an upload URL
    const uploadUrl: string = await ctx.runMutation(
      api.functions.internal.api.storage.fileStorage.generateUploadUrl
    );

    // Upload the file to the generated URL
    const response: Response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": fileData.type },
      body: fileData.arrayBuffer,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    // Get the storage ID from the response
    const { storageId }: { storageId: string } = await response.json();

    // Get the file URL
    const fileUrl: string | null = await ctx.runQuery(
      api.functions.internal.api.storage.fileStorage.getFileUrl,
      {
        storageId,
      }
    );

    if (!fileUrl) {
      throw new Error("Failed to get file URL");
    }

    return fileUrl;
  },
});
