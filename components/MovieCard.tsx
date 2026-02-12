import React, { useState, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { Movie } from '../types';
import { getImageUrl } from '../services/api';
import { favoritesService } from '../services/favorites';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favoritesService.isFavorite(movie.slug));
    
    // Listen for updates in case changed from elsewhere
    const handleUpdate = () => setIsFavorite(favoritesService.isFavorite(movie.slug));
    window.addEventListener('favorites-updated', handleUpdate);
    return () => window.removeEventListener('favorites-updated', handleUpdate);
  }, [movie.slug]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    favoritesService.toggleFavorite(movie);
    // State is updated via event listener, but we can optimistically update too if needed
  };

  // Determine audio badge color and text based on language
  const getAudioBadge = () => {
    const lang = (movie.lang || '').toLowerCase();
    if (lang.includes('vietsub')) return { text: 'Vietsub', color: 'bg-green-500' };
    if (lang.includes('thuyết minh') || lang.includes('long tieng')) return { text: 'Thuyết Minh', color: 'bg-yellow-500' };
    if (lang.includes('lồng tiếng')) return { text: 'Lồng Tiếng', color: 'bg-blue-500' };
    return { text: 'HD', color: 'bg-red-600' };
  };

  const badge = getAudioBadge();

  // Check history (mock check)
  const history = JSON.parse(localStorage.getItem('watchHistory') || '{}');
  const progress = history[movie.slug] ? 50 : 0; // Simplified progress bar logic

  return (
    <div className="group block relative w-full overflow-hidden rounded-md bg-[#1f1f1f] transition-all hover:scale-105 hover:z-10 duration-300">
      <Link to={`/phim/${movie.slug}`}>
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={getImageUrl(movie.poster_url || movie.thumb_url)}
            alt={movie.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:opacity-60"
            loading="lazy"
          />
          
          {/* Audio Badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold text-white uppercase rounded shadow-md ${badge.color}`}>
            {badge.text}
          </div>

          {/* Favorite Button on Card */}
          <button 
            onClick={handleToggleFavorite}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm transition-colors z-20 group/btn"
            title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart 
                className={`w-4 h-4 transition-colors ${isFavorite ? 'text-[#E50914] fill-[#E50914]' : 'text-white group-hover/btn:text-[#E50914]'}`} 
            />
          </button>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
              <Play fill="white" className="text-white ml-1 w-5 h-5" />
            </div>
          </div>

          {/* Progress Bar for history */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div className="h-full bg-[#E50914]" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-white font-medium text-sm truncate group-hover:text-[#E50914] transition-colors">
            {movie.name}
          </h3>
          <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
            <span>{movie.year}</span>
            <span className="border border-gray-600 px-1 rounded text-[10px]">{movie.quality || 'HD'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
