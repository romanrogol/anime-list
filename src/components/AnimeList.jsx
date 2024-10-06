import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import Filters from './Filters';
import Pagination from './Pagination';
import { useStore } from '../store/useStore';
import './AnimeList.css';

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("popularity");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { addToWatchLater } = useStore();
  const watchLaterCount = useStore(state => state.watchLater.length);
  const [pageSize, setPageSize] = useState(24); 

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth <= 768 ? 10 : 24); 
    };

    handleResize(); // Установить начальное значение
    window.addEventListener('resize', handleResize); // Обработчик изменения размера

    return () => {
      window.removeEventListener('resize', handleResize); // Очистка
    };
  }, []);

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          ...(searchTerm && { title: searchTerm }),
        };

        const res = await axios.get(`https://api.jikan.moe/v4/anime`, { params });
        if (res.data && res.data.data) {
          setAnimes(res.data.data);
          // setTotalPages(res.data.pagination.last_visible_page);
          setTotalPages(Math.ceil(res.data.pagination.items.total / pageSize));
        }
      } catch (error) {
        console.error("Error fetching animes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [page, searchTerm]);

  // Фильтры и сортировка
  const applyFilters = (animes) => {
    let filteredAnimes = [...animes];

    if (searchTerm) {
      filteredAnimes = filteredAnimes.filter(anime => 
        anime.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.type) {
      filteredAnimes = filteredAnimes.filter(anime => anime.type === filters.type);
    }
    if (filters.rating) {
      filteredAnimes = filteredAnimes.filter(anime => anime.rating === filters.rating);
    }
    if (filters.status) {
      filteredAnimes = filteredAnimes.filter(anime => anime.status === filters.status);
    }
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredAnimes = filteredAnimes.filter(anime => new Date(anime.aired.from) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredAnimes = filteredAnimes.filter(anime => new Date(anime.aired.to) <= endDate);
    }
    if (filters.genres && filters.genres.length > 0) {
      filteredAnimes = filteredAnimes.filter(anime => {
        const genreNames = anime.genres.map(g => g.name);
        return filters.genres.some(genre => genreNames.includes(genre));
      });
    }
    if (filters.excludeGenres && filters.excludeGenres.length > 0) {
      filteredAnimes = filteredAnimes.filter(anime => {
        const genreNames = anime.genres.map(g => g.name);
        return !filters.excludeGenres.some(excludedGenre => genreNames.includes(excludedGenre));
      });
    }
    if (filters.producers && filters.producers.length > 0) {
      filteredAnimes = filteredAnimes.filter(anime =>
        anime.producers && anime.producers.some(producer => filters.producers.includes(producer.name))
      );
    }

    return filteredAnimes;
  };

  const sortAnimes = (animes) => {
    return [...animes].sort((a, b) => {
      if (sort === "popularity") {
        return b.popularity - a.popularity;
      }
      if (sort === "score") {
        return b.score - a.score;
      }
      if (sort === "favorites") {
        return b.favorites - a.favorites;
      }
      if (sort === "episodes") {
        return b.episodes - a.episodes;
      }
      if (sort === "aired_from") {
        return new Date(a.aired.from) - new Date(b.aired.from);
      }
      if (sort === "aired_to") {
        return new Date(b.aired.to) - new Date(a.aired.to);
      }
      return 0;
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); 
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); 
  };

  const handleAddToWatchLater = (anime) => {
    addToWatchLater(anime);
  };

  const filteredAndSortedAnimes = sortAnimes(applyFilters(animes));
  const displayedAnimes = filteredAndSortedAnimes.slice(0, pageSize); 

  return (
    <div className='anime-main'>
      <div className='search-filters'>
        <input 
          type="text" 
          placeholder="Search by title" 
          onChange={handleSearchChange} 
        />
        <select onChange={(e) => setSort(e.target.value)}>
          <option value="popularity">Popular</option>
          <option value="score">Score</option>
          <option value="favorites">Favorites</option>
          <option value="episodes">Episodes</option>
          <option value="aired_from">Aired From</option>
          <option value="aired_to">Aired To</option>
        </select>
        <button className='btn-showfilters' onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <div className='watch-later-wrap'>
          <Link to="/watch-later" className='watch-later-link'>
            Watch later ({watchLaterCount}) 
          </Link>
        </div>
      </div>
      {showFilters && (
        <Filters 
          onFilterChange={handleFilterChange} 
          animes={animes}
        />
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="anime-list">
          {displayedAnimes.length > 0 ? (
            displayedAnimes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} onAddToWatchLater={handleAddToWatchLater} />
            ))
          ) : (
            <p>No animes found</p>
          )}
        </div>
      )}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} /> 
    </div>
  );
};

export default AnimeList;






