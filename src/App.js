import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AnimeList from './components/AnimeList';
import AnimeDetail from './pages/AnimeDetail';
import WatchLater from './pages/WatchLater';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnimeList />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/watch-later" element={<WatchLater />} />
      </Routes>
    </Router>
  );
};

export default App;

