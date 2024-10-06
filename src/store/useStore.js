import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(persist(
  (set) => ({
    watchLater: [],
    addToWatchLater: (anime, expectationRating = 1) => set((state) => ({
      watchLater: [...state.watchLater, { ...anime, expectationRating, addedAt: new Date() }]
    })),
    updateWatchLaterRating: (animeId, newExpectationRating) => set((state) => ({
      watchLater: state.watchLater.map(anime =>
        anime.mal_id === animeId ? { ...anime, expectationRating: newExpectationRating } : anime
      )
    })),
    removeFromWatchLater: (animeId) => set((state) => ({
      watchLater: state.watchLater.filter(anime => anime.mal_id !== animeId)
    })),
    get watchLaterCount() {
      return this.watchLater.length; 
    },
  }),
  {
    name: 'anime-watch-later',
    getStorage: () => localStorage,
  }
));





