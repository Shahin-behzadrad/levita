import { YoutubeVideo } from "@/types/youtube";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function searchYoutubeVideos(
  query: string
): Promise<YoutubeVideo | null> {
  if (!YOUTUBE_API_KEY) {
    console.error("YouTube API key is not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        query
      )}&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube videos");
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    return {
      id: video.id.videoId,
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.medium.url,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
    };
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    return null;
  }
}
