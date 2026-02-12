import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, X, History, Heart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, getImageUrl } from '../services/api';
import { Movie } from '../types';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchTimeoutRef = useRef<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smart Search Debounce
  useEffect(() => {
    if (searchQuery.length > 1) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await api.searchMovies(searchQuery, 5);
        setSearchResults(results);
      }, 500);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/tim-kiem?k=${encodeURIComponent(searchQuery)}`);
        setIsSearchOpen(false);
        setSearchResults([]);
    }
  };

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Phim Bộ', path: '/danh-sach/phim-bo' },
    { name: 'Phim Lẻ', path: '/danh-sach/phim-le' },
    { name: 'Hoạt Hình', path: '/danh-sach/hoat-hinh' },
    { name: 'TV Shows', path: '/danh-sach/tv-shows' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#141414] shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-[#E50914] tracking-tighter uppercase">
              PASTA<span className="text-white">PHIM</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-[#E50914] ${
                    location.pathname === link.path ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 md:space-x-6 text-white">
            
            {/* Search Bar */}
            <div className="relative">
              <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64 bg-black/50 border border-gray-600 rounded-full px-3 py-1' : 'w-8 bg-transparent'}`}>
                <Search 
                    className="w-5 h-5 cursor-pointer hover:text-[#E50914]" 
                    onClick={() => {
                        setIsSearchOpen(true);
                        // Focus logic could go here
                    }}
                />
                <form onSubmit={handleSearchSubmit} className="flex-1">
                    <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className={`bg-transparent border-none outline-none text-sm text-white ml-2 w-full ${!isSearchOpen && 'hidden'}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(!!searchQuery), 200)}
                    />
                </form>
                {isSearchOpen && searchQuery && (
                     <X className="w-4 h-4 text-gray-400 cursor-pointer" onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchOpen(false); }} />
                )}
              </div>

              {/* Smart Search Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#1f1f1f] border border-gray-700 rounded-md shadow-xl overflow-hidden">
                    {searchResults.map((movie) => (
                        <Link 
                            key={movie._id} 
                            to={`/phim/${movie.slug}`}
                            className="flex items-center p-3 hover:bg-[#2a2a2a] border-b border-gray-800 last:border-0"
                            onClick={() => {
                                setIsSearchOpen(false);
                                setSearchResults([]);
                            }}
                        >
                            <img src={getImageUrl(movie.thumb_url)} alt={movie.name} className="w-10 h-14 object-cover rounded mr-3" />
                            <div className="overflow-hidden">
                                <h4 className="text-sm font-medium text-white truncate">{movie.name}</h4>
                                <p className="text-xs text-gray-400 truncate">{movie.year} • {movie.origin_name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
                <Link to="/favorites" className="hover:text-[#E50914] transition-colors" title="Phim yêu thích">
                    <Heart className="w-5 h-5" />
                </Link>
                <Link to="/history" className="hover:text-[#E50914] transition-colors" title="Lịch sử xem">
                    <History className="w-5 h-5" />
                </Link>
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#E50914] to-orange-500 flex items-center justify-center cursor-pointer">
                    <User className="w-5 h-5" />
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#141414] border-t border-gray-800 absolute w-full px-4 py-4 flex flex-col space-y-4 shadow-2xl">
            {navLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-300 font-medium hover:text-[#E50914]"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {link.name}
                </Link>
            ))}
             <div className="flex items-center space-x-4 pt-4 border-t border-gray-800 text-gray-400">
                <Link to="/favorites">Yêu thích</Link>
                <Link to="/history">Lịch sử</Link>
             </div>
        </div>
      )}
    </header>
  );
};

export default Header;
