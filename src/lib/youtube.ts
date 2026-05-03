/**
 * YouTube RSS parser — sin API key, solo feed público
 * Canal: TravelAgentIA
 * Canal RSS: https://www.youtube.com/feeds/videos.xml?channel_id=UCc2SjI5FP_DR2udtiVKpqWw
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
  channelTitle: string;
  published: Date;
  description: string;
  url: string;
}

const CHANNEL_ID = 'UCc2SjI5FP_DR2udtiVKpqWw';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function parseDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function extractText(el: Element | null, tag: string): string {
  return el?.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
}

export async function getYouTubeVideos(max = 12): Promise<YouTubeVideo[]> {
  const res = await fetch(RSS_URL);
  if (!res.ok) throw new Error(`YouTube RSS error: ${res.status}`);

  const xml = await res.text();

  // Parser XML mínimo sin dependencias
  const entries = xml.match(/<entry[^>]*>[\s\S]*?<\/entry>/gi) ?? [];
  const videos: YouTubeVideo[] = [];

  for (const entry of entries.slice(0, max)) {
    const get = (tag: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i'));
      return m?.[1]?.trim() ?? '';
    };

    const videoId = get('yt:videoId') || get('videoId') || '';
    const title = get('title');
    const publishedStr = get('published');
    const description = get('media:description') || get('description');

    // Thumbnail via known pattern
    const thumbnail = getThumbnail(videoId);

    videos.push({
      id: videoId,
      videoId,
      title,
      thumbnail,
      channelTitle: 'TravelAgentIA',
      published: new Date(publishedStr),
      description,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }

  return videos;
}

export async function getYouTubeChannel(): Promise<{
  title: string;
  videos: YouTubeVideo[];
}> {
  const videos = await getYouTubeVideos(12);
  const title = videos[0]?.channelTitle ?? 'TravelAgentIA';
  return { title, videos };
}
