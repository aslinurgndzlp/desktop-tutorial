import React, { createContext, useState, useEffect, useContext } from 'react';

const CommentContext = createContext();

// Prepopulated mock comments for a couple of movies to make the app feel alive on first load
const INITIAL_MOCK_COMMENTS = {
  101: [
    {
      id: 'c1',
      username: 'Sinan Yılmaz',
      email: 'sinan@example.com',
      content: 'Christopher Nolan yine harika bir iş çıkarmış. Senaryo tam bir başyapıt! Kesinlikle tekrar izlenmeli.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      id: 'c2',
      username: 'Elif Kaya',
      email: 'elif@example.com',
      content: 'Müzikler ve görsellik muazzam. Rüya içindeki rüya katmanları çok iyi kurgulanmış.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ],
  102: [
    {
      id: 'c3',
      username: 'Ahmet Demir',
      email: 'ahmet@example.com',
      content: 'Uzay filmleri arasında gelmiş geçmiş en iyisi. Hans Zimmer\'ın org temalı müzikleri tüyler ürpertiyor.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    }
  ]
};

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState(() => {
    try {
      const saved = localStorage.getItem('movie_explorer_comments');
      return saved ? JSON.parse(saved) : INITIAL_MOCK_COMMENTS;
    } catch (e) {
      console.error('Failed to parse comments from LocalStorage', e);
      return INITIAL_MOCK_COMMENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('movie_explorer_comments', JSON.stringify(comments));
  }, [comments]);

  const getMovieComments = (movieId) => {
    return comments[Number(movieId)] || [];
  };

  const addMovieComment = (movieId, username, email, content) => {
    if (!movieId || !username || !content.trim()) return false;

    const newComment = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      username,
      email,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setComments((prev) => {
      const movieComments = prev[Number(movieId)] || [];
      return {
        ...prev,
        [Number(movieId)]: [newComment, ...movieComments]
      };
    });

    return true;
  };

  const deleteMovieComment = (movieId, commentId) => {
    setComments((prev) => {
      const movieComments = prev[Number(movieId)] || [];
      const filtered = movieComments.filter(c => c.id !== commentId);
      return {
        ...prev,
        [Number(movieId)]: filtered
      };
    });
  };

  return (
    <CommentContext.Provider value={{ comments, getMovieComments, addMovieComment, deleteMovieComment }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};
export default CommentContext;
