import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AnimeDetail.css';

const AnimeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) {
        setError("Anime ID is required.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnime(res.data.data);
      } catch (error) {
        setError("Failed to fetch anime details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!anime) return <p>Anime not found.</p>;

  const handleBack = () => {
    navigate(-1); 
  };
  
  return (
    <div className="anime-detail">
      <button onClick={handleBack}>
      Back
      </button>
      <h1>{anime.title_english || anime.title}</h1>
      <img src={anime.images?.jpg?.large_image_url} alt={anime.title} />
      {anime.trailer?.url && (
        <iframe
          width="800"
          height="480"
          src={anime.trailer.url.replace("watch?v=", "embed/")}
          title="Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
      <p><span>Original Title:</span> {anime.title}</p>
      <p><span>Translated Title:</span> {anime.title_english || "Not available"}</p>
      <p><span>Score:</span> {anime.score || "No score available"}</p>
      <p><span>Scored_by:</span> {anime.scored_by || "No score available"}</p>
      <p><span>Favorites:</span> {anime.favorites || "No favorites available"}</p>
      <p><span>Episodes:</span> {anime.episodes || "No episode information available"}</p>
      <p><span>Start Date:</span> {formatDate(anime.aired?.from)}</p>
      <p><span>End Date:</span> {formatDate(anime.aired?.to)}</p>
      <p><span>Producers:</span> {anime.producers?.map(prod => prod.name).join(', ') || "No producers available"}</p>
      <p><span>Genres:</span> {anime.genres?.map(genre => genre.name).join(', ') || "No genres available"}</p>
      <p><span>Themes:</span> {anime.themes?.map(theme => theme.name).join(', ') || "No themes available"}</p>
      <p><span>Related:</span> {anime.relations?.map(rel => rel.name).join(', ') || "No related anime available"}</p>
      <p><span>Synopsis:</span> {anime.synopsis || "No synopsis available"}</p>
    </div>
  );
};


export default AnimeDetail;

