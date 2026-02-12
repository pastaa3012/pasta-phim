import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { favoritesService } from '../services/favorites';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const loadFavorites = () => {
    setMovies(favoritesService.getFavorites());
  };

  useEffect(() => {
    loadFavorites();

    const handleUpdate = () => loadFavorites();
    window.addEventListener('favorites-updated', handleUpdate);
    return () => window.removeEventListener('favorites-updated', handleUpdate);
  }, []);

  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-2xl font-bold text-white uppercase tracking-wide border-l-4 border-[#E50914] pl-3 flex items-center">
                Phim Yêu Thích <Heart className="w-6 h-6 ml-3 text-[#E50914] fill-current" />
            </h1>
            <span className="ml-4 text-gray-500 text-sm">{movies.length} phim</span>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
             <Heart className="w-16 h-16 mb-4 opacity-20" />
             <p className="text-xl">Chưa có phim yêu thích nào.</p>
             <Link to="/" className="mt-4 px-6 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded transition-colors">
                Khám phá ngay
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
