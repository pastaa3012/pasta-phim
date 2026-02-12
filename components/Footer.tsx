import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-[#E50914] uppercase tracking-tighter">PASTAPHIM</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Trải nghiệm xem phim đỉnh cao với kho phim khổng lồ, chất lượng sắc nét và tốc độ nhanh chóng. Cập nhật liên tục mỗi ngày.
            </p>
            <p className="text-xs text-gray-500">© 2024 PastaPhim. All rights reserved.</p>
          </div>

          {/* Column 2: Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">Khám Phá</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#E50914] transition-colors">Phim Mới</a></li>
                <li><a href="#" className="hover:text-[#E50914] transition-colors">Phim Bộ</a></li>
                <li><a href="#" className="hover:text-[#E50914] transition-colors">Phim Lẻ</a></li>
                <li><a href="#" className="hover:text-[#E50914] transition-colors">Top IMDb</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Hỗ Trợ</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#E50914] transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-[#E50914] transition-colors">DMCA</a></li>
                <li><a href="#" className="hover:text-[#E50914] transition-colors">Điều khoản</a></li>
                <li><a href="#" className="hover:text-[#E50914] transition-colors">Riêng tư</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Social */}
          <div>
            <h3 className="text-white font-bold mb-4">Kết nối</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#E50914] transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#E50914] transition-colors text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#E50914] transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#E50914] transition-colors text-white">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Đăng ký nhận tin mới</p>
                <div className="flex">
                    <input type="email" placeholder="Email của bạn..." className="bg-[#1f1f1f] border border-gray-700 text-white px-4 py-2 rounded-l w-full outline-none focus:border-[#E50914]" />
                    <button className="bg-[#E50914] px-4 py-2 rounded-r font-bold text-white hover:bg-red-700">Gửi</button>
                </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-xs text-gray-600">Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
