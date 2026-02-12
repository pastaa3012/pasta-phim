import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, getImageUrl } from '../services/api';
import { favoritesService } from '../services/favorites';
import { MovieDetail } from '../types';
import { Play, Clock, Calendar, Star, Heart, Share2, Film, Check } from 'lucide-react';

const Detail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      api.getMovieDetail(slug).then((data) => {
        setMovie(data);
        if (data) {
             setIsFavorite(favoritesService.isFavorite(data.slug));
        }
        setLoading(false);
      });
    }
  }, [slug]);

  const toggleFavorite = () => {
      if (movie) {
          const newState = favoritesService.toggleFavorite(movie);
          setIsFavorite(newState);
      }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E50914]"></div>
    </div>
  );

  if (!movie) return <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">Không tìm thấy phim</div>;

  const firstEpisodeSlug = movie.episodes?.[0]?.server_data?.[0]?.slug || '';
  
  return (
    <div className="bg-[#141414] min-h-screen text-gray-300">
      
      {/* Top Section with Backdrop */}
      <div className="relative w-full md:h-[600px] h-auto">
        {/* Backdrop Image */}
        <div className="absolute inset-0 overflow-hidden">
            <img 
                src={getImageUrl(movie.poster_url || movie.thumb_url)} 
                alt="Backdrop" 
                className="w-full h-full object-cover blur-md opacity-40 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-[1440px] mx-auto px-4 py-8 md:py-20 h-full flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            
            {/* Poster */}
            <div className="flex-shrink-0 w-64 md:w-80 rounded-lg overflow-hidden shadow-2xl border border-white/10 relative group">
                <img 
                    src={getImageUrl(movie.thumb_url)} 
                    alt={movie.name} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#E50914] text-white font-bold px-3 py-1 rounded shadow text-sm">
                    {movie.quality || 'HD'}
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">{movie.name}</h1>
                    <h2 className="text-xl text-gray-400 font-light">{movie.origin_name} ({movie.year})</h2>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm">
                    <div className="flex items-center text-yellow-400 font-bold bg-white/10 px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 mr-1.5 fill-current" />
                        8.5 IMDb
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {movie.time || 'N/A'}
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {movie.year}
                    </div>
                     <div className="flex items-center text-gray-300">
                        <Film className="w-4 h-4 mr-1.5" />
                        {movie.episode_current || 'Full'}
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {movie.category?.map(cat => (
                        <span key={cat.id} className="text-xs font-medium border border-gray-600 px-3 py-1 rounded hover:bg-white/10 cursor-pointer transition-colors">
                            {cat.name}
                        </span>
                    ))}
                    {movie.country?.map(c => (
                        <span key={c.id} className="text-xs font-medium border border-gray-600 px-3 py-1 rounded hover:bg-white/10 cursor-pointer transition-colors text-gray-400">
                            {c.name}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {firstEpisodeSlug ? (
                         <Link 
                         to={`/xem-phim/${movie.slug}/${firstEpisodeSlug}`}
                         className="flex items-center justify-center px-8 py-4 bg-[#E50914] text-white rounded font-bold hover:bg-[#b0070f] transition-all transform hover:scale-105 shadow-lg shadow-red-900/20"
                       >
                         <Play className="w-6 h-6 mr-2 fill-current" />
                         XEM PHIM
                       </Link>
                    ) : (
                        <button disabled className="px-8 py-4 bg-gray-700 text-white rounded font-bold cursor-not-allowed">
                            Coming Soon
                        </button>
                    )}
                   
                    <div className="flex gap-4 justify-center">
                        <button className="flex items-center justify-center px-6 py-4 bg-gray-800 text-white rounded font-bold hover:bg-gray-700 transition-colors">
                            <Play className="w-5 h-5 mr-2" />
                            Trailer
                        </button>
                        <button 
                            onClick={toggleFavorite}
                            className={`p-4 rounded transition-colors ${isFavorite ? 'bg-white text-[#E50914] hover:bg-gray-200' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                            title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                        >
                            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-4 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Synopsis */}
                <div className="max-w-3xl pt-4">
                    <h3 className="text-white font-bold mb-2">Nội dung phim</h3>
                    <p className="leading-relaxed text-gray-400 text-sm md:text-base">
                        {movie.content?.replace(/<[^>]*>/g, '')}
                    </p>
                </div>

                {/* Cast */}
                <div className="pt-2">
                    <span className="text-white font-bold">Đạo diễn: </span>
                    <span className="text-gray-400">{movie.director?.join(', ') || 'N/A'}</span>
                    <br />
                    <span className="text-white font-bold">Diễn viên: </span>
                    <span className="text-gray-400">{movie.actor?.join(', ') || 'N/A'}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Related Section placeholder */}
      <div className="max-w-[1440px] mx-auto px-4 py-12 border-t border-gray-800">
          <h3 className="text-2xl text-white font-bold mb-6">Có thể bạn muốn xem</h3>
          <p className="text-gray-500">Danh sách phim liên quan đang được cập nhật...</p>
      </div>

    </div>
  );
};

export default Detail;
