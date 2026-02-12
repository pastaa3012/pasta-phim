import { Movie } from '../types';

const KEY = 'favoriteMovies';

export interface FavoriteMovie extends Movie {
  addedAt: number;
}

export const favoritesService = {
  getFavorites: (): FavoriteMovie[] => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || '{}');
      return Object.values(stored).sort((a: any, b: any) => b.addedAt - a.addedAt) as FavoriteMovie[];
    } catch {
      return [];
    }
  },

  isFavorite: (slug: string): boolean => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || '{}');
      return !!stored[slug];
    } catch {
      return false;
    }
  },

  toggleFavorite: (movie: Movie): boolean => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (stored[movie.slug]) {
        delete stored[movie.slug];
        localStorage.setItem(KEY, JSON.stringify(stored));
        // Dispatch custom event to update UI instantly across components
        window.dispatchEvent(new Event('favorites-updated'));
        return false;
      } else {
        stored[movie.slug] = { ...movie, addedAt: Date.now() };
        localStorage.setItem(KEY, JSON.stringify(stored));
        window.dispatchEvent(new Event('favorites-updated'));
        return true;
      }
    } catch {
      return false;
    }
  }
};
