# Feedback System - Quick Reference

## 🚀 Quick Start

### For Users
1. **Book a property** → Booking status must be confirmed/completed
2. **Navigate to property page** → Click "Write a Review"
3. **Fill form** → Rating (1-5 stars), Title, Comment
4. **Submit** → Review appears immediately

### For Developers
```javascript
// Import review component
import ReviewSection from './components/ReviewSection';

// Use in property page
<ReviewSection propertyId={property._id} />
```

---

## 📋 API Endpoints Cheat Sheet

```javascript
// Create review (requires booking)
POST /api/reviews
Body: { userId, propertyId, rating, title, comment }

// Get property reviews
GET /api/reviews/property/:propertyId

// Get user's all reviews
GET /api/reviews/user/:userId

// Get review statistics
GET /api/reviews/stats/:propertyId

// Update review (owner only)
PUT /api/reviews/:reviewId
Body: { userId, rating, title, comment }

// Delete review (owner only)
DELETE /api/reviews/:reviewId
Body: { userId }

// Mark review helpful
POST /api/reviews/:reviewId/helpful
Body: { userId }
```

---

## 🎯 Key Features

| Feature | Location | Access |
|---------|----------|--------|
| **Add Review** | Property Detail Page | Users with confirmed booking |
| **View Reviews** | Property Detail Page | Everyone |
| **Edit Review** | Property Page OR Dashboard → My Reviews | Review owner only |
| **Delete Review** | Property Page OR Dashboard → My Reviews | Review owner only |
| **My Reviews** | Dashboard → ⭐ My Reviews Tab | Logged-in users |
| **Review Stats** | Property Detail Page | Everyone |

---

## ✅ Validation Rules

### Backend Checks
- ✅ User must be authenticated
- ✅ User must have a confirmed/completed booking for the property
- ✅ User can only have ONE review per property
- ✅ User can only edit/delete their OWN reviews
- ✅ Rating must be between 1-5
- ✅ Title max length: 100 characters
- ✅ Comment max length: 1000 characters

### Frontend Validation
- ✅ All fields required (rating, title, comment)
- ✅ Edit/Delete buttons only show for review owner
- ✅ Confirmation dialog before deletion
- ✅ Real-time error messages

---

## 🔧 Components Overview

### ReviewSection.jsx
**Purpose:** Display and manage reviews on property detail page  
**Features:**
- View all property reviews
- Add new review
- Edit own review (inline)
- Delete own review
- Review statistics

**Usage:**
```jsx
<ReviewSection propertyId={propertyId} />
```

### MyReviews.jsx
**Purpose:** Dashboard component for managing user's all reviews  
**Features:**
- List all user reviews across properties
- Show property details for each review
- Edit review (inline form)
- Delete review
- Empty state message

**Usage:**
```jsx
<MyReviews />
```

---

## 🎨 UI Elements

### Star Rating Display
```javascript
const renderStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};
// rating=4 → ★★★★☆
```

### Edit/Delete Buttons
```jsx
{isOwnReview && (
  <>
    <button onClick={() => handleEdit(review)}>
      ✏️ Edit
    </button>
    <button onClick={() => handleDelete(review._id)}>
      🗑️ Delete
    </button>
  </>
)}
```

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| "Can only review booked properties" | No booking or booking not confirmed | Check booking status in database |
| Edit buttons not showing | User ID mismatch | Verify `review.userId._id === user._id` |
| Review not updating | State not refreshing | Call `fetchReviews()` after edit/delete |
| Stats not recalculating | Not fetching stats | Call `fetchReviewStats()` after changes |

---

## 📊 Database Schema

```javascript
// Review Schema
{
  userId: ObjectId (ref: 'User'),
  propertyId: ObjectId (ref: 'Property'),
  rating: Number (1-5),
  title: String (max 100),
  comment: String (max 1000),
  userName: String,
  helpful: [ObjectId],
  verified: Boolean,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing Checklist

- [ ] Create review with valid booking → ✅ Success
- [ ] Create review without booking → ❌ Error message
- [ ] Edit own review → ✅ Updates immediately
- [ ] Try to edit someone else's review → ❌ Buttons hidden
- [ ] Delete own review → ✅ Removed after confirmation
- [ ] View reviews in dashboard → ✅ All reviews displayed
- [ ] Stats update after create/edit/delete → ✅ Recalculates

---

## 💡 Tips & Best Practices

1. **Always check booking status** before allowing reviews
2. **Validate ownership** on both frontend and backend
3. **Use confirmation dialogs** before destructive actions
4. **Update stats** after every review operation
5. **Show loading states** during API calls
6. **Provide clear error messages** to users
7. **Populate user data** in review responses
8. **Use optimistic UI updates** for better UX

---

## 📞 Support

For detailed documentation, see:
- `/docs/FEEDBACK_SYSTEM_GUIDE.md` - Complete implementation guide
- Backend: `/backend/controller/reviewController.js`
- Frontend: `/frontend/src/components/ReviewSection.jsx`
- Dashboard: `/frontend/src/components/MyReviews.jsx`

---

**Last Updated:** October 16, 2025
