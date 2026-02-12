import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Watch from './pages/Watch';
import SearchPage from './pages/SearchPage';
import History from './pages/History';
import Favorites from './pages/Favorites';
import ScrollToTop from './components/ScrollToTop';

// Helper component to scroll to top on route change
const ScrollToTopHelper = () => {
    return <ScrollToTop />;
};

function App() {
  return (
    <Router>
      <ScrollToTopHelper />
      <div className="flex flex-col min-h-screen bg-[#141414] font-sans text-gray-100">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phim/:slug" element={<Detail />} />
            <Route path="/xem-phim/:slug/:episodeSlug" element={<Watch />} />
            <Route path="/tim-kiem" element={<SearchPage />} />
            <Route path="/danh-sach/:type" element={<SearchPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
