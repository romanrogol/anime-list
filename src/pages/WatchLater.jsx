import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import './WatchLater.css'; 

const WatchLater = () => {
  const { watchLater, removeFromWatchLater } = useStore();
  const [sort, setSort] = useState("expectationRating");
  const [page, setPage] = useState(1);
  const itemsPerPage = window.innerWidth < 768 ? 5 : 12; 

  const sortedWatchLater = [...watchLater].sort((a, b) => {
    if (sort === "expectationRating") {
      return Number(b.expectationRating) - Number(a.expectationRating); 
    }
    return new Date(b.addedAt) - new Date(a.addedAt); 
  });

  const paginatedWatchLater = sortedWatchLater.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedWatchLater.length / itemsPerPage);

  const handleRemove = (animeId) => {
    removeFromWatchLater(animeId);
  };

  return (
    <div className="watch-later-container">
      <h1>Watch later</h1>
      <select onChange={(e) => setSort(e.target.value)} value={sort}>
        <option value="expectationRating">Sort by expectation rating</option>
        <option value="date">Sort by added date</option>
      </select>
      <button>
        <Link to="/" className='backtomain'>
          Back
        </Link>
      </button>
      <div className="anime-list">
        {paginatedWatchLater.length > 0 ? (
          paginatedWatchLater.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} onRemove={handleRemove} />
          ))
        ) : (
          <p>The list is empty</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </div>
  );
};

export default WatchLater;

