import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Movie } from '../types';
import HeroSlider from '../components/HeroSlider';
import MovieCard from '../components/MovieCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieSection: React.FC<{ title: string; movies: Movie[]; linkTo?: string }> = ({ title, movies, linkTo }) => {
  if (movies.length === 0) return null;
  
  return (
    <div className="py-8 border-b border-gray-800/50 last:border-0">
      <div className="flex justify-between items-center mb-6 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-[#E50914] pl-3 uppercase tracking-wide">
          {title}
        </h2>
        {linkTo && (
            <Link to={linkTo} className="text-xs md:text-sm text-gray-400 hover:text-[#E50914] flex items-center transition-colors">
            Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 md:px-0">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<Movie[]>([]);
  const [singleMovies, setSingleMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Parallel fetching
        const [news, series, singles] = await Promise.all([
            api.getNewMovies(1),
            api.getMoviesByType('phim-bo', 1),
            api.getMoviesByType('phim-le', 1)
        ]);
        
        setNewMovies(news);
        setSeriesMovies(series.slice(0, 12));
        setSingleMovies(singles.slice(0, 12));
      } catch (e) {
        console.error("Home fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E50914]"></div>
        </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen pb-20">
      {/* Hero Slider with New Movies */}
      <HeroSlider movies={newMovies.slice(0, 6)} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10">
        
        {/* Featured / Trending (using new movies 6-12) */}
         <div className="mb-12">
            <MovieSection title="Phim Đề Cử" movies={newMovies.slice(6, 12)} />
         </div>

         {/* Series */}
         <MovieSection title="Phim Bộ Hot" movies={seriesMovies} linkTo="/danh-sach/phim-bo" />

         {/* Single Movies */}
         <MovieSection title="Phim Lẻ Mới" movies={singleMovies} linkTo="/danh-sach/phim-le" />

         {/* Cartoons/Other could go here */}
      </div>
    </div>
  );
};

export default Home;
