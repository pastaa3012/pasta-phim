import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../services/api';
import { favoritesService } from '../services/favorites';
import { Play, Plus, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSliderProps {
  movies: Movie[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(timer);
  }, [movies]);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (currentMovie) {
        setIsFavorite(favoritesService.isFavorite(currentMovie.slug));
    }
  }, [currentMovie]);

  const toggleFavorite = () => {
    if (currentMovie) {
        const newState = favoritesService.toggleFavorite(currentMovie);
        setIsFavorite(newState);
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(currentMovie.poster_url || currentMovie.thumb_url)}
          alt={currentMovie.name}
          className="w-full h-full object-cover object-top"
        />
        {/* Gradient Overlay - Darkens bottom and left */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-4 animate-fade-in-up">
            
            <div className="flex items-center space-x-2 text-[#E50914] font-bold text-sm uppercase tracking-wider">
               <span>New Release</span>
               <span className="w-1 h-1 rounded-full bg-white"></span>
               <span>{currentMovie.type || 'Movie'}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              {currentMovie.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-300 font-light">
              {currentMovie.origin_name}
            </h2>

            <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span className="font-bold text-white">8.5</span>
                </div>
                <span>{currentMovie.year}</span>
                <span className="border border-gray-500 px-2 py-0.5 rounded">{currentMovie.quality || 'HD'}</span>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Link 
                to={`/phim/${currentMovie.slug}`}
                className="flex items-center px-6 py-3 bg-[#E50914] text-white rounded font-bold hover:bg-[#b0070f] transition-colors"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Xem Ngay
              </Link>
              <button 
                onClick={toggleFavorite}
                className={`flex items-center px-6 py-3 backdrop-blur-sm text-white rounded font-bold transition-colors ${isFavorite ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-600/60 hover:bg-gray-500/80'}`}
              >
                {isFavorite ? <Check className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {isFavorite ? 'Đã Thêm' : 'Yêu Thích'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-8 right-8 flex space-x-2">
          {movies.slice(0, 5).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#E50914] w-6' : 'bg-white/50 hover:bg-white'}`}
              />
          ))}
      </div>
    </div>
  );
};

export default HeroSlider;
