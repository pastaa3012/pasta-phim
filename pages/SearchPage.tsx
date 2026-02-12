import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { Filter } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { type } = useParams<{ type?: string }>();

  // Determine context: Search vs List Category
  const isSearch = location.pathname.includes('/tim-kiem');
  const query = new URLSearchParams(location.search).get('k');
  
  let pageTitle = 'Danh sách phim';
  if (isSearch) pageTitle = `Kết quả tìm kiếm: "${query}"`;
  else if (type === 'phim-le') pageTitle = 'Phim Lẻ';
  else if (type === 'phim-bo') pageTitle = 'Phim Bộ';
  else if (type === 'hoat-hinh') pageTitle = 'Hoạt Hình';
  else if (type === 'tv-shows') pageTitle = 'TV Shows';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMovies([]);
      try {
        if (isSearch && query) {
          const res = await api.searchMovies(query, 24);
          setMovies(res);
        } else if (type) {
           // Mapping router param to api expected param if needed, 
           // currently strict matching 'phim-le', 'phim-bo' works with my api service
           const res = await api.getMoviesByType(type as any);
           setMovies(res);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location, type, query, isSearch]);

  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-2xl font-bold text-white uppercase tracking-wide border-l-4 border-[#E50914] pl-3">
                {pageTitle}
            </h1>
            
            {/* Fake Smart Filter UI */}
            <div className="flex items-center gap-3 mt-4 md:mt-0">
                <div className="flex items-center gap-2 text-gray-400 text-sm mr-2">
                    <Filter className="w-4 h-4" />
                    <span>Bộ lọc:</span>
                </div>
                <select className="bg-[#1f1f1f] text-gray-300 text-xs py-2 px-3 rounded border border-gray-700 outline-none">
                    <option>Thể loại</option>
                    <option>Hành động</option>
                    <option>Tình cảm</option>
                </select>
                <select className="bg-[#1f1f1f] text-gray-300 text-xs py-2 px-3 rounded border border-gray-700 outline-none">
                    <option>Quốc gia</option>
                    <option>Âu Mỹ</option>
                    <option>Hàn Quốc</option>
                </select>
                 <select className="bg-[#1f1f1f] text-gray-300 text-xs py-2 px-3 rounded border border-gray-700 outline-none">
                    <option>Năm</option>
                    <option>2024</option>
                    <option>2023</option>
                </select>
            </div>
        </div>

        {/* Content */}
        {loading ? (
           <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
           </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
             <p className="text-xl">Không tìm thấy kết quả nào.</p>
             <p className="text-sm mt-2">Hãy thử từ khóa khác hoặc kiểm tra lại bộ lọc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
