import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
  const { watchLater, addToWatchLater, removeFromWatchLater, updateWatchLaterRating } = useStore();
  const isInWatchLater = watchLater.some(item => item.mal_id === anime.mal_id);
  
  const initialRating = isInWatchLater ? watchLater.find(item => item.mal_id === anime.mal_id).expectationRating : 1;
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    if (isInWatchLater) {
      updateWatchLaterRating(anime.mal_id, rating);
    }
  }, [rating, isInWatchLater, anime.mal_id, updateWatchLaterRating]);

  const handleToggleWatchLater = () => {
    if (isInWatchLater) {
      removeFromWatchLater(anime.mal_id);
    } else {
      addToWatchLater(anime, rating);
    }
  };

  console.log("Anime ID:", anime.mal_id);


  return (
    <div className="anime-card">
      <Link to={`/anime/${anime.mal_id}`} className='cardinfo-link'>
        <div className='anime-image-wrap'>
          <img src={anime.images.jpg.large_image_url} alt={anime.title} />
        </div>
        <div className='cardinfo-wrap'>
          <h3>{anime.title_english || anime.title}</h3>
          <div className='cardinfo-ratings-wrap'>
            <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-star "><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg><strong>{anime.score}</strong></p>
            <p>Scored by: {anime.scored_by} users</p>
            <p># <strong>{anime.rank}</strong> Ranking</p>
          </div>
        </div>
        </Link>
        <div className='card-button-wrap'>
          <label for ='rating'>Expectation rating</label>
          <select name ='rating' value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[...Array(10)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <button onClick={handleToggleWatchLater}>
            {isInWatchLater ? 'Remove from list' : 'Add to list'}
          </button>
        </div>
    </div>
  );
};

export default AnimeCard;

