import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ReviewSection = ({ propertyId }) => {
  const { user, api } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchReviewStats();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/api/reviews/property/${propertyId}?limit=10`);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await api.get(`/api/reviews/stats/${propertyId}`);
      setReviewStats(response.data.data);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    setSubmitLoading(true);
    try {
      const reviewData = {
        ...newReview,
        userId: user._id,
        propertyId
      };
      
      let response;
      if (editingReviewId) {
        // Update existing review
        response = await api.put(`/api/reviews/${editingReviewId}`, reviewData);
        setReviews(prev => prev.map(r => r._id === editingReviewId ? response.data.data : r));
        alert('Review updated successfully!');
      } else {
        // Create new review
        response = await api.post('/api/reviews', reviewData);
        setReviews(prev => [response.data.data, ...prev]);
        alert('Review submitted successfully!');
      }
      
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      setEditingReviewId(null);
      fetchReviewStats(); // Refresh stats
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setNewReview({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
    setEditingReviewId(review._id);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await api.delete(`/api/reviews/${reviewId}`, {
        data: { userId: user._id }
      });
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      fetchReviewStats();
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleCancelEdit = () => {
    setNewReview({ rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
    setEditingReviewId(null);
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading reviews...</div>;
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginTop: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          Reviews {reviewStats && `(${reviewStats.totalReviews})`}
        </h3>
        {user && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Stats */}
      {reviewStats && reviewStats.totalReviews > 0 && (
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
              {reviewStats.averageRating.toFixed(1)}
            </div>
            <div>
              <div style={{ fontSize: '24px', color: '#ffc107' }}>
                {renderStars(Math.round(reviewStats.averageRating))}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                Based on {reviewStats.totalReviews} reviews
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={submitReview} style={{ 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h4 style={{ marginTop: 0 }}>
            {editingReviewId ? 'Edit Your Review' : 'Write Your Review'}
          </h4>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Rating:
            </label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            >
              {[5,4,3,2,1].map(num => (
                <option key={num} value={num}>
                  {num} Star{num !== 1 ? 's' : ''} - {renderStars(num)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Review Title:
            </label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({...newReview, title: e.target.value})}
              placeholder="Give your review a title"
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Your Review:
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              placeholder="Tell others about your experience..."
              required
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={submitLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: submitLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {submitLoading ? 'Submitting...' : editingReviewId ? 'Update Review' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No reviews yet. Be the first to review this property!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((review) => {
            const isOwnReview = user && review.userId._id === user._id;
            
            return (
              <div key={review._id} style={{
                padding: '20px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>{review.title}</h5>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: '#ffc107', fontSize: '16px' }}>
                        {renderStars(review.rating)}
                      </span>
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        by {review.userName}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#999', fontSize: '12px' }}>
                      {formatDate(review.createdAt)}
                    </span>
                    {isOwnReview && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleEditReview(review)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          title="Edit review"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          title="Delete review"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ margin: 0, color: '#555', lineHeight: '1.5' }}>
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;