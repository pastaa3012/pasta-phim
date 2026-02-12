export interface Movie {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  time?: string;
  quality?: string;
  lang?: string;
  episode_current?: string;
  content?: string;
  type?: string;
  chieurap?: boolean;
  sub_docquyen?: boolean;
  actor?: string[];
  director?: string[];
  category?: { id: string; name: string; slug: string }[];
  country?: { id: string; name: string; slug: string }[];
}

export interface Episode {
  server_name: string;
  server_data: {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }[];
}

export interface MovieDetail extends Movie {
  episodes: Episode[];
  status?: string;
  trailer_url?: string;
  view?: number;
}

export interface ApiResponse<T> {
  status: boolean;
  items?: T[];
  data?: {
    items: T[];
    params?: any;
    breadCrumb?: any;
    seoOnPage?: any;
  };
  movie?: MovieDetail;
  episodes?: Episode[];
}

export interface WatchHistoryItem {
  slug: string;
  episodeSlug: string;
  name: string;
  origin_name?: string;
  epName: string;
  thumb_url: string;
  timestamp: number;
}
