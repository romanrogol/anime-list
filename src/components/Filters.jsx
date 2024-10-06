import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ onFilterChange, animes }) => {
  const [type, setType] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [genres, setGenres] = useState([]);
  const [excludeGenres, setExcludeGenres] = useState([]);
  const [producers, setProducers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const uniqueTypes = [...new Set(animes.map(anime => anime.type))];
  const uniqueRatings = [...new Set(animes.map(anime => anime.rating))];
  const uniqueStatuses = [...new Set(animes.map(anime => anime.status))];
  const availableGenres = [...new Set(animes.flatMap(anime => anime.genres.map(g => g.name)))];
  const availableProducers = [...new Set(animes.flatMap(anime => anime.producers.map(p => p.name)))];

  const handleApplyFilters = () => {
    const filters = {
      type,
      rating,
      status,
      startDate,
      endDate,
      genres,
      excludeGenres,
      producers,
    };
    onFilterChange(filters);
  };

  const toggleGenre = (genre) => {
    setGenres((prev) => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };
  const toggleExcludeGenre = (genre) => {
    setExcludeGenres((prev) => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleProducer = (producer) => {
    setProducers((prev) => 
      prev.includes(producer) ? prev.filter(p => p !== producer) : [...prev, producer]
    );
  };

  return (
    <div className="filters">
      <div className='filters-first'>
        <div className='filters-type'>
          <h4>Type</h4>
          <select onChange={(e) => setType(e.target.value)}>
            <option value="">Select Type</option>
            {uniqueTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className='filters-rating'>
          <h4>Rating</h4>
          <select onChange={(e) => setRating(e.target.value)}>
            <option value="">Select Rating</option>
            {uniqueRatings.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className='filters-status'>
          <h4>Status</h4>
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            {uniqueStatuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='filters-date'>      
        <div className='filters-date-start'>
          <h4>Start Date</h4>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className='filters-date-end'>
          <h4>End Date</h4>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>    
      <div>
        <h4>Genres</h4>
        {availableGenres.map((genre, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={genres.includes(genre)}
              onChange={() => toggleGenre(genre)}
            />
            {genre}
          </label>
        ))}
      </div>
      <div>
        <h4>Exclude Genres</h4>
        {availableGenres.map((genre, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={excludeGenres.includes(genre)}
              onChange={() => toggleExcludeGenre(genre)}
            />
            {genre}
          </label>
        ))}
      </div>
      <div>
        <h4>Producers</h4>
        {availableProducers.map((producer, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={producers.includes(producer)}
              onChange={() => toggleProducer(producer)}
            />
            {producer}
          </label>
        ))}
      </div>

      <button onClick={handleApplyFilters}>Apply Filters</button>
    </div>
  );
};

export default Filters;

