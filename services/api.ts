import { ApiResponse, Movie, MovieDetail } from '../types';

const BASE_URL = 'https://phimapi.com';
const IMAGE_BASE_URL = 'https://phimimg.com/';

export const getImageUrl = (url: string) => {
  if (!url) return 'https://picsum.photos/300/450';
  if (url.startsWith('http')) return url;
  return `${IMAGE_BASE_URL}${url}`;
};

export const api = {
  getNewMovies: async (page = 1): Promise<Movie[]> => {
    try {
      const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);
      const data: ApiResponse<Movie> = await res.json();
      return data.items || [];
    } catch (error) {
      console.error("Error fetching new movies:", error);
      return [];
    }
  },

  getMovieDetail: async (slug: string): Promise<MovieDetail | null> => {
    try {
      const res = await fetch(`${BASE_URL}/phim/${slug}`);
      const data: ApiResponse<Movie> = await res.json();
      if (data.status && data.movie) {
        return { ...data.movie, episodes: data.episodes || [] };
      }
      return null;
    } catch (error) {
      console.error("Error fetching movie detail:", error);
      return null;
    }
  },

  searchMovies: async (keyword: string, limit = 10): Promise<Movie[]> => {
    try {
      const res = await fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=${limit}`);
      const data: ApiResponse<Movie> = await res.json();
      return data.data?.items || [];
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  },

  getMoviesByType: async (type: 'phim-le' | 'phim-bo' | 'hoat-hinh' | 'tv-shows', page = 1): Promise<Movie[]> => {
    try {
      const res = await fetch(`${BASE_URL}/v1/api/danh-sach/${type}?page=${page}&limit=24`);
      const data: ApiResponse<Movie> = await res.json();
      return data.data?.items || [];
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  }
};
