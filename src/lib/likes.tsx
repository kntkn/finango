'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LikesContextType {
  likes: string[];
  addLike: (assetId: string) => void;
  removeLike: (assetId: string) => void;
  isLiked: (assetId: string) => boolean;
  toggleLike: (assetId: string) => void;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('finango-likes');
    if (stored) {
      try {
        setLikes(JSON.parse(stored));
      } catch {
        setLikes([]);
      }
    }
  }, []);

  const saveLikes = (newLikes: string[]) => {
    setLikes(newLikes);
    localStorage.setItem('finango-likes', JSON.stringify(newLikes));
  };

  const addLike = (assetId: string) => {
    if (!likes.includes(assetId)) {
      saveLikes([...likes, assetId]);
    }
  };

  const removeLike = (assetId: string) => {
    saveLikes(likes.filter(id => id !== assetId));
  };

  const isLiked = (assetId: string) => likes.includes(assetId);

  const toggleLike = (assetId: string) => {
    if (isLiked(assetId)) {
      removeLike(assetId);
    } else {
      addLike(assetId);
    }
  };

  return (
    <LikesContext.Provider value={{ likes, addLike, removeLike, isLiked, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within LikesProvider');
  }
  return context;
}
