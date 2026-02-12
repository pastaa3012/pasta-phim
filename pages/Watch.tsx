import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { MovieDetail, Episode, WatchHistoryItem } from '../types';
import { AlertCircle, Lightbulb, MessageSquare, Server } from 'lucide-react';

const Watch: React.FC = () => {
  const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<any>(null);
  const [serverIndex, setServerIndex] = useState(0);
  const [lightOff, setLightOff] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState<number | null>(null);

  useEffect(() => {
    if (slug) {
      api.getMovieDetail(slug).then((data) => {
        setMovie(data);
      });
    }
  }, [slug]);

  // Find current episode object when movie data or slug changes
  useEffect(() => {
    if (movie && episodeSlug) {
      // KKPhim structure: episodes is an array of server objects.
      // Usually episodes[0] contains the list of episodes in server_data
      const serverData = movie.episodes?.[0]?.server_data;
      if (serverData) {
        const ep = serverData.find((e) => e.slug === episodeSlug);
        if (ep) {
            setCurrentEpisode(ep);
            // Save to history
            const history = JSON.parse(localStorage.getItem('watchHistory') || '{}');
            const historyItem: WatchHistoryItem = {
                slug: movie.slug,
                episodeSlug: ep.slug,
                name: movie.name,
                origin_name: movie.origin_name,
                epName: ep.name,
                thumb_url: movie.thumb_url,
                timestamp: Date.now()
            };
            history[movie.slug] = historyItem;
            localStorage.setItem('watchHistory', JSON.stringify(history));
        }
      }
    }
  }, [movie, episodeSlug]);

  // Simulated Auto-Next logic
  // Since we use iframe, we can't truly detect 'ended' event easily cross-origin.
  // This is a UI placeholder for the logic requested.
  const handleAutoNext = () => {
      if (!movie || !currentEpisode) return;
      const serverData = movie.episodes?.[0]?.server_data;
      if (!serverData) return;
      
      const currentIndex = serverData.findIndex(e => e.slug === currentEpisode.slug);
      if (currentIndex !== -1 && currentIndex < serverData.length - 1) {
          const nextEp = serverData[currentIndex + 1];
          navigate(`/xem-phim/${movie.slug}/${nextEp.slug}`);
      }
  };

  if (!movie || !currentEpisode) return <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">Loading Player...</div>;

  const serverData = movie.episodes?.[0]?.server_data || [];
  const currentIndex = serverData.findIndex(e => e.slug === currentEpisode.slug);
  const nextEpisode = currentIndex !== -1 && currentIndex < serverData.length - 1 ? serverData[currentIndex + 1] : null;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${lightOff ? 'bg-black' : 'bg-[#141414]'} text-gray-300 pb-20`}>
      
      {/* Theater Mode Container */}
      <div className={`w-full ${lightOff ? 'z-50' : ''} transition-all duration-500`}>
        <div className="w-full aspect-video bg-black relative max-w-[1440px] mx-auto shadow-2xl">
            <iframe
                key={currentEpisode.link_embed} // Force reload on change
                src={currentEpisode.link_embed}
                title="Movie Player"
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; encrypted-media"
            ></iframe>
        </div>
      </div>

      {/* Controls & Tools */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-800">
              <div>
                  <h1 className="text-2xl text-white font-bold mb-1">
                      {movie.name} - <span className="text-[#E50914]">{currentEpisode.name}</span>
                  </h1>
                  <p className="text-sm text-gray-500">Đang xem tại Server VIP 1</p>
              </div>

              <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setLightOff(!lightOff)}
                    className={`flex items-center px-4 py-2 rounded font-medium text-sm transition-colors ${lightOff ? 'bg-[#E50914] text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {lightOff ? 'Bật đèn' : 'Tắt đèn'}
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded font-medium text-sm transition-colors">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Báo lỗi
                  </button>
                  {nextEpisode && (
                      <button 
                        onClick={handleAutoNext}
                        className="flex items-center px-4 py-2 bg-[#E50914] text-white hover:bg-red-700 rounded font-bold text-sm transition-colors shadow-lg shadow-red-900/20"
                      >
                          Tập tiếp theo
                      </button>
                  )}
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Episodes & Servers */}
              <div className="lg:col-span-2 space-y-8">
                  
                  {/* Servers */}
                  <div className="bg-[#1f1f1f] p-4 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-400 uppercase tracking-wider">
                          <Server className="w-4 h-4" /> Chọn Server
                      </div>
                      <div className="flex gap-2">
                          <button className="px-4 py-1.5 bg-[#E50914] text-white text-xs font-bold rounded">VIP #1 (Fast)</button>
                          <button className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded">VIP #2</button>
                          <button className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded">Backup #3</button>
                      </div>
                  </div>

                  {/* Episode List */}
                  <div>
                      <h3 className="text-white font-bold mb-4 flex items-center">
                          Danh sách tập
                          <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">{serverData.length} tập</span>
                      </h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                          {serverData.map((ep: any) => (
                              <Link
                                key={ep.slug}
                                to={`/xem-phim/${movie.slug}/${ep.slug}`}
                                className={`
                                    px-2 py-2 text-center text-sm font-medium rounded transition-all
                                    ${ep.slug === currentEpisode.slug 
                                        ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/40 scale-105' 
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}
                                `}
                              >
                                  {ep.name}
                              </Link>
                          ))}
                      </div>
                  </div>

                  {/* Comments */}
                  <div className="mt-8 bg-[#1f1f1f] p-6 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-6 text-white font-bold">
                          <MessageSquare className="w-5 h-5 text-[#E50914]" />
                          Bình luận
                      </div>
                      <div className="text-center py-12 text-gray-500 bg-black/20 rounded border border-dashed border-gray-700">
                          Hệ thống bình luận đang được bảo trì. Vui lòng quay lại sau.
                          <br />
                          <span className="text-xs text-gray-600 mt-2 block">(Facebook Comment Integration would go here)</span>
                      </div>
                  </div>
              </div>

              {/* Right: Sidebar Info */}
              <div className="lg:col-span-1">
                  <div className="bg-[#1f1f1f] rounded-lg p-4 border border-white/5 sticky top-24">
                      <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2">Thông tin phim</h3>
                      <div className="flex gap-4 mb-4">
                          <img src={movie.thumb_url} alt="" className="w-20 h-28 object-cover rounded" />
                          <div>
                              <div className="text-white font-bold text-sm mb-1">{movie.name}</div>
                              <div className="text-gray-500 text-xs mb-2">{movie.origin_name}</div>
                              <div className="text-xs bg-gray-800 inline-block px-2 py-1 rounded text-gray-300">
                                  {movie.year}
                              </div>
                          </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-6">
                          {movie.content?.replace(/<[^>]*>/g, '')}
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Watch;
