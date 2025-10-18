import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const FavoriteButton = ({ propertyId, onFavoriteChange }) => {
  const { user, api } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Intentionally omit checkFavoriteStatus from deps — stable for this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
    checkFavoriteStatus();
  }, [propertyId, user]);

  const checkFavoriteStatus = async () => {
    if (!user?._id || !propertyId) return;
    
    try {
      const response = await api.get(`/api/users/${user._id}/favorites`);
      const favorites = response.data.data || [];
      setIsFavorite(favorites.some(fav => fav._id === propertyId));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user?._id) {
      alert('Please log in to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/api/users/${user._id}/favorites/${propertyId}`);
        setIsFavorite(false);
        if (onFavoriteChange) onFavoriteChange(propertyId, false);
      } else {
        await api.post(`/api/users/${user._id}/favorites/${propertyId}`);
        setIsFavorite(true);
        if (onFavoriteChange) onFavoriteChange(propertyId, true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: isFavorite ? '#e74c3c' : '#666',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease'
      }}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? '⏳' : (isFavorite ? '❤️' : '🤍')}
    </button>
  );
};

export default FavoriteButton;