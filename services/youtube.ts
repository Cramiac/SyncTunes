import { YouTubeVideo, YouTubeSearchResponse } from '@/types/youtube';

// Note: In a real app, you would use the YouTube Data API v3
// For this demo, we'll simulate the API responses
const MOCK_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
    channelTitle: 'Rick Astley',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=120', width: 120, height: 90 },
      medium: { url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=320', width: 320, height: 180 },
      high: { url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=480', width: 480, height: 360 },
    },
    duration: 'PT3M33S',
    publishedAt: '2009-10-25T07:57:33Z',
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Despacito - Luis Fonsi ft. Daddy Yankee',
    channelTitle: 'Luis Fonsi',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=120', width: 120, height: 90 },
      medium: { url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=320', width: 320, height: 180 },
      high: { url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=480', width: 480, height: 360 },
    },
    duration: 'PT4M42S',
    publishedAt: '2017-01-12T19:30:00Z',
  },
  {
    id: '9bZkp7q19f0',
    title: 'PSY - GANGNAM STYLE (강남스타일) M/V',
    channelTitle: 'officialpsy',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg?auto=compress&cs=tinysrgb&w=120', width: 120, height: 90 },
      medium: { url: 'https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg?auto=compress&cs=tinysrgb&w=320', width: 320, height: 180 },
      high: { url: 'https://images.pexels.com/photos/1434819/pexels-photo-1434819.jpeg?auto=compress&cs=tinysrgb&w=480', width: 480, height: 360 },
    },
    duration: 'PT4M12S',
    publishedAt: '2012-07-15T08:34:21Z',
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Queen - Bohemian Rhapsody (Official Video Remastered)',
    channelTitle: 'Queen Official',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=120', width: 120, height: 90 },
      medium: { url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=320', width: 320, height: 180 },
      high: { url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=480', width: 480, height: 360 },
    },
    duration: 'PT5M55S',
    publishedAt: '2008-08-01T15:53:09Z',
  },
  {
    id: 'L_jWHffIx5E',
    title: 'Smash Mouth - All Star (Official Music Video)',
    channelTitle: 'Smash Mouth',
    thumbnails: {
      default: { url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=120', width: 120, height: 90 },
      medium: { url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=320', width: 320, height: 180 },
      high: { url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=480', width: 480, height: 360 },
    },
    duration: 'PT3M20S',
    publishedAt: '2010-06-05T02:19:45Z',
  },
];

export class YouTubeService {
  private static instance: YouTubeService;
  
  static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeSearchResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter mock videos based on query
    const filteredVideos = MOCK_YOUTUBE_VIDEOS.filter(video =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.channelTitle.toLowerCase().includes(query.toLowerCase())
    );

    return {
      items: filteredVideos.slice(0, maxResults),
      pageInfo: {
        totalResults: filteredVideos.length,
        resultsPerPage: maxResults,
      },
    };
  }

  parseDuration(duration: string): number {
    // Parse ISO 8601 duration format (PT3M33S) to seconds
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  youtubeVideoToSong(video: YouTubeVideo): import('@/types/youtube').Song {
    return {
      id: video.id,
      title: this.extractSongTitle(video.title),
      artist: video.channelTitle,
      album: 'YouTube',
      duration: this.parseDuration(video.duration),
      coverUrl: video.thumbnails.medium.url,
      youtubeId: video.id,
      source: 'youtube',
    };
  }

  private extractSongTitle(fullTitle: string): string {
    // Remove common patterns like "(Official Video)", "- Artist Name", etc.
    return fullTitle
      .replace(/\(Official.*?\)/gi, '')
      .replace(/\[Official.*?\]/gi, '')
      .replace(/- .+$/g, '')
      .trim();
  }
}