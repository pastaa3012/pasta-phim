import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { Trash2, PlayCircle, Clock } from 'lucide-react';
import { WatchHistoryItem } from '../types';

const History: React.FC = () => {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('watchHistory') || '{}');
    const list = Object.values(stored) as WatchHistoryItem[];
    // Sort by timestamp desc
    list.sort((a, b) => b.timestamp - a.timestamp);
    setHistory(list);
  }, []);

  const clearHistory = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử xem?')) {
        localStorage.removeItem('watchHistory');
        setHistory([]);
    }
  };

  const removeItem = (slug: string) => {
      const stored = JSON.parse(localStorage.getItem('watchHistory') || '{}');
      delete stored[slug];
      localStorage.setItem('watchHistory', JSON.stringify(stored));
      setHistory(prev => prev.filter(item => item.slug !== slug));
  };

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-20">
       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-white uppercase tracking-wide border-l-4 border-[#E50914] pl-3">
                    Lịch sử xem
                </h1>
                {history.length > 0 && (
                    <button 
                        onClick={clearHistory}
                        className="flex items-center text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Xóa tất cả
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Clock className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-xl font-medium">Bạn chưa xem phim nào.</p>
                    <Link to="/" className="mt-4 text-[#E50914] hover:underline">Khám phá phim ngay</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {history.map((item) => (
                        <div key={item.slug} className="bg-[#1f1f1f] rounded-lg overflow-hidden flex shadow-lg hover:shadow-red-900/10 transition-all group relative">
                            <Link to={`/xem-phim/${item.slug}/${item.episodeSlug}`} className="w-1/3 relative overflow-hidden">
                                <img 
                                    src={getImageUrl(item.thumb_url)} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-10 h-10 text-white" />
                                </div>
                            </Link>
                            <div className="w-2/3 p-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">
                                        <Link to={`/phim/${item.slug}`} className="hover:text-[#E50914] transition-colors">
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-2">{item.origin_name}</p>
                                    <div className="text-[#E50914] text-sm font-medium flex items-center">
                                        Đang xem: {item.epName}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700/50">
                                    <span className="text-xs text-gray-500">
                                        {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                                    </span>
                                    <button 
                                        onClick={() => removeItem(item.slug)}
                                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                        title="Xóa khỏi lịch sử"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
       </div>
    </div>
  );
};

export default History;
