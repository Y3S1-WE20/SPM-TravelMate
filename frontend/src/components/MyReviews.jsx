import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MyReviews = () => {
  const { user, api } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fetchMyReviews();
    }
  }, [user]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reviews/user/${user._id}`);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditForm({ rating: 5, title: '', comment: '' });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const response = await api.put(`/api/reviews/${editingReviewId}`, {
        ...editForm,
        userId: user._id
      });
      
      setReviews(prev => prev.map(r => 
        r._id === editingReviewId ? response.data.data : r
      ));
      
      setEditingReviewId(null);
      setEditForm({ rating: 5, title: '', comment: '' });
      alert('Review updated successfully!');
    } catch (error) {
      console.error('Error updating review:', error);
      alert(error.response?.data?.message || 'Failed to update review');
    } finally {
      setSubmitLoading(false);
    }
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
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error.response?.data?.message || 'Failed to delete review');
    }
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
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading your reviews...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
        My Reviews ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>📝 No reviews yet</p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Book a property and share your experience!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((review) => {
            const isEditing = editingReviewId === review._id;
            
            return (
              <div
                key={review._id}
                style={{
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa'
                }}
              >
                {/* Property Info */}
                {review.propertyId && (
                  <div style={{
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {review.propertyId.images && review.propertyId.images.length > 0 && (
                        <img
                          src={`http://localhost:5001${review.propertyId.images[0]}`}
                          alt={review.propertyId.title}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      )}
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                          {review.propertyId.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                          📍 {review.propertyId.city}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  /* Edit Form */
                  <form onSubmit={handleUpdateReview}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                        Rating:
                      </label>
                      <select
                        value={editForm.rating}
                        onChange={(e) => setEditForm({...editForm, rating: parseInt(e.target.value)})}
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          fontSize: '16px',
                          width: '200px'
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
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
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
                        value={editForm.comment}
                        onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
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
                        {submitLoading ? 'Saving...' : '💾 Save Changes'}
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
                ) : (
                  /* Display Mode */
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>
                          {review.title}
                        </h5>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '10px'
                        }}>
                          <span style={{ color: '#ffc107', fontSize: '18px' }}>
                            {renderStars(review.rating)}
                          </span>
                          <span style={{ color: '#999', fontSize: '12px' }}>
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditClick(review)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    <p style={{
                      margin: 0,
                      color: '#555',
                      lineHeight: '1.6',
                      fontSize: '15px'
                    }}>
                      {review.comment}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
