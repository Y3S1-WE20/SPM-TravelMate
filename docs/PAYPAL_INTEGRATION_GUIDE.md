# PayPal Payment Integration - Complete Setup Guide

## 🎯 Overview
Complete PayPal Sandbox integration for hotel booking payments with automatic payment tracking in user and hotel owner profiles.

---

## 📦 Installation Steps

### 1. Install PayPal React SDK

```powershell
cd F:\SPM-TravelMate\frontend
npm install @paypal/react-paypal-js
```

### 2. Install Node Fetch (Backend)

```powershell
cd F:\SPM-TravelMate\backend
npm install node-fetch
```

---

## 🔑 PayPal Sandbox Setup

### Step 1: Create PayPal Developer Account
1. Go to https://developer.paypal.com/
2. Sign up or log in with your PayPal account
3. Navigate to **Dashboard**

### Step 2: Create Sandbox App
1. Go to **My Apps & Credentials**
2. Click **Create App**
3. App Name: `TravelMate-Sandbox`
4. App Type: **Merchant**
5. Click **Create App**

### Step 3: Get API Credentials
After creating the app, you'll see:
- **Client ID** (starts with `A...`)
- **Secret** (click "Show" to reveal)

### Step 4: Configure Environment Variables

**Backend (.env file):**
```env
# Add these lines to F:\SPM-TravelMate\backend\.env

PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_secret_here
PAYPAL_MODE=sandbox
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env file):**
Create `F:\SPM-TravelMate\frontend\.env`:
```env
REACT_APP_PAYPAL_CLIENT_ID=your_sandbox_client_id_here
```

⚠️ **Important:** Use the SAME Client ID in both files!

---

## 🏗️ Files Created/Modified

### Backend Files

#### ✨ NEW Files:
1. **`models/Payment.js`** - Payment transaction schema
2. **`controller/paymentController.js`** - Payment logic
3. **`routes/paymentRoutes.js`** - Payment API routes

#### ✏️ Modified Files:
1. **`models/User.js`** - Added payment history fields
2. **`server.js`** - Added payment routes
3. **`.env`** - Added PayPal configuration

### Frontend Files

#### ✏️ Modified Files:
1. **`components/BookingPage.jsx`** - Added PayPal payment step
2. **`components/BookingPage.css`** - Added payment step styles

---

## 🔄 Payment Flow

### User Journey

```
1. User selects dates and rooms
   ↓
2. User fills in personal information
   ↓
3. User clicks "Proceed to Payment"
   ↓
4. Booking created (status: pending)
   ↓
5. PayPal button appears
   ↓
6. User clicks PayPal button
   ↓
7. PayPal payment window opens
   ↓
8. User logs in to PayPal (sandbox account)
   ↓
9. User approves payment
   ↓
10. Payment captured
    ↓
11. Booking status updated to "confirmed"
    ↓
12. Payment recorded in:
    - Payment collection
    - User's paymentHistory
    - Hotel owner's receivedPayments
    ↓
13. User redirected to dashboard
    ↓
14. Confirmation email sent (future enhancement)
```

---

## 📊 Database Schema Changes

### Payment Collection
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Booking),
  userId: ObjectId (ref: User),
  propertyOwnerId: ObjectId (ref: User),
  propertyId: ObjectId (ref: Property),
  amount: 150.00,
  currency: "USD",
  paypalOrderId: "8AB12345CD67890",
  paypalPayerId: "PAYER123",
  paypalPaymentId: "PAY123456",
  status: "completed",
  guestEmail: "user@example.com",
  guestName: "John Doe",
  paymentMethod: "PayPal",
  paymentDate: ISODate("2025-10-16T10:30:00Z"),
  platformFee: 7.50,  // 5% commission
  ownerPayout: 142.50, // 95% to owner
  paypalResponse: { /* full PayPal response */ },
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### User Model Updates
```javascript
{
  // Existing fields...
  
  // For regular users (guests)
  paymentHistory: [{
    paymentId: ObjectId,
    amount: 150.00,
    date: ISODate,
    bookingId: ObjectId,
    status: "completed"
  }],
  
  // For hotel owners
  receivedPayments: [{
    paymentId: ObjectId,
    amount: 142.50,  // After 5% fee
    date: ISODate,
    bookingId: ObjectId,
    propertyId: ObjectId,
    status: "completed"
  }],
  
  totalEarnings: 142.50  // Sum of all ownerPayouts
}
```

---

## 🔌 API Endpoints

### Payment Routes

```
POST /api/payments/create-order
Body: { bookingId, amount }
Response: { orderId, paymentId }

POST /api/payments/capture/:orderId
Response: { payment, booking, captureDetails }

GET /api/payments/:paymentId
Response: { payment details }

GET /api/payments/user/:userId
Response: { user payment history }

GET /api/payments/owner/:ownerId
Response: { owner received payments, totalEarnings }
```

---

## 🧪 Testing Guide

### Create Sandbox Test Accounts

1. Go to https://developer.paypal.com/dashboard
2. Navigate to **Sandbox → Accounts**
3. You'll see default test accounts:
   - **Personal Account** (Buyer) - use this to pay
   - **Business Account** (Seller) - receives payments

### Test Payment Flow

#### Step 1: Start the Servers

**Backend:**
```powershell
cd F:\SPM-TravelMate\backend
npm start
```

**Frontend:**
```powershell
cd F:\SPM-TravelMate\frontend
npm start
```

#### Step 2: Make a Test Booking

1. Open http://localhost:3000
2. Browse properties
3. Click "Book Now" on any property
4. Fill in dates and guest information
5. Click "Proceed to Payment"
6. You should see the PayPal button

#### Step 3: Complete Payment

1. Click the **PayPal** button
2. PayPal sandbox window opens
3. Log in with **Personal (Buyer)** sandbox account
   - Email: shown in PayPal developer dashboard
   - Password: shown in PayPal developer dashboard
4. Review payment details
5. Click **Pay Now** or **Complete Purchase**
6. Window closes automatically
7. You're redirected to dashboard

#### Step 4: Verify Payment

**In Database (MongoDB Compass or Atlas):**

1. Check **payments** collection:
   ```javascript
   { status: "completed", amount: <amount>, bookingId: <id> }
   ```

2. Check **bookings** collection:
   ```javascript
   { _id: <bookingId>, status: "confirmed" }
   ```

3. Check **users** collection (guest):
   ```javascript
   { 
     paymentHistory: [{ 
       amount: <amount>, 
       status: "completed" 
     }] 
   }
   ```

4. Check **users** collection (hotel owner):
   ```javascript
   { 
     receivedPayments: [{ 
       amount: <ownerPayout>,
       status: "completed"
     }],
     totalEarnings: <sum>
   }
   ```

---

## 💡 PayPal Sandbox Test Credentials

### Default Sandbox Accounts

After creating your app, PayPal automatically creates test accounts:

**Personal Account (Buyer):**
- Email: sb-xxxxx@personal.example.com
- Password: (shown in dashboard)
- Balance: $10,000 (default)

**Business Account (Seller):**
- Email: sb-xxxxx@business.example.com
- Password: (shown in dashboard)
- Balance: $0 (receives payments)

### View/Create More Accounts

1. Go to https://developer.paypal.com/dashboard
2. Click **Sandbox → Accounts**
3. Click **Create Account** for custom test accounts
4. Choose account type:
   - **Personal** - for buyers
   - **Business** - for sellers

---

## 🔒 Security Features

### Payment Security
- ✅ PayPal handles all sensitive card data
- ✅ HTTPS encryption (in production)
- ✅ Order verification before capture
- ✅ Transaction validation
- ✅ Full PayPal response logging

### Backend Validation
- ✅ Booking exists before payment
- ✅ Amount validation
- ✅ Duplicate payment prevention
- ✅ Owner verification
- ✅ Payment status tracking

---

## 🐛 Common Issues & Fixes

### Issue 1: PayPal Button Not Showing

**Cause:** Missing or invalid Client ID

**Fix:**
1. Check `.env` files have correct `PAYPAL_CLIENT_ID`
2. Restart both frontend and backend servers
3. Clear browser cache
4. Check browser console for errors

### Issue 2: "Merchant account is not configured"

**Cause:** Using production credentials in sandbox mode

**Fix:**
1. Ensure `PAYPAL_MODE=sandbox` in backend `.env`
2. Use **Sandbox** Client ID, not production
3. Verify app is created in sandbox environment

### Issue 3: Payment Fails After Approval

**Cause:** Server error during capture

**Fix:**
1. Check backend console logs
2. Verify PayPal API credentials
3. Ensure payment record was created
4. Check network tab for API errors

### Issue 4: "Booking not found" Error

**Cause:** Booking not created before payment

**Fix:**
1. Check booking submission worked (Step 2)
2. Verify `currentBookingId` is set
3. Check backend booking creation logs
4. Ensure proper error handling in `handleSubmitBooking`

### Issue 5: Owner Not Receiving Payment Record

**Cause:** Property owner field missing

**Fix:**
1. Verify property has `owner` field
2. Check property owner is a valid user
3. Update property owner assignment script
4. Check backend logs for user update errors

---

## 📈 Commission/Fee Structure

### Default: 5% Platform Fee

**Example Calculation:**
- Booking Total: $100.00
- Platform Fee (5%): $5.00
- Owner Payout (95%): $95.00

### Modify Fee Percentage

Edit `backend/models/Payment.js`:

```javascript
paymentSchema.pre('save', function(next) {
  if (this.isModified('amount') && !this.ownerPayout) {
    this.platformFee = this.amount * 0.10; // Change to 10%
    this.ownerPayout = this.amount * 0.90; // Change to 90%
  }
  next();
});
```

---

## 🚀 Production Deployment

### Before Going Live

1. **Switch to Production Credentials:**
   ```env
   PAYPAL_MODE=production
   PAYPAL_CLIENT_ID=<production_client_id>
   PAYPAL_CLIENT_SECRET=<production_secret>
   ```

2. **Create Production App:**
   - Go to PayPal Developer Dashboard
   - Switch to **Live** mode
   - Create new app for production
   - Get production credentials

3. **Update Frontend:**
   ```env
   REACT_APP_PAYPAL_CLIENT_ID=<production_client_id>
   ```

4. **Test Thoroughly:**
   - Use real PayPal accounts
   - Test with small amounts
   - Verify all payment flows
   - Check refund process

5. **Security Checklist:**
   - [ ] HTTPS enabled
   - [ ] Environment variables secured
   - [ ] API rate limiting implemented
   - [ ] Payment logs encrypted
   - [ ] Error handling robust
   - [ ] Refund policy defined

---

## 📞 Support & Resources

### PayPal Resources
- Developer Dashboard: https://developer.paypal.com/dashboard
- API Documentation: https://developer.paypal.com/docs/api/overview/
- Sandbox Guide: https://developer.paypal.com/docs/api-basics/sandbox/
- Integration Guide: https://developer.paypal.com/sdk/js/

### Project Documentation
- Payment Model: `backend/models/Payment.js`
- Payment Controller: `backend/controller/paymentController.js`
- Payment Routes: `backend/routes/paymentRoutes.js`
- Frontend Integration: `frontend/src/components/BookingPage.jsx`

---

## ✅ Implementation Checklist

### Backend Setup
- [ ] Created Payment model
- [ ] Created payment controller
- [ ] Created payment routes
- [ ] Updated User model with payment fields
- [ ] Added payment routes to server.js
- [ ] Configured PayPal credentials in .env
- [ ] Started backend server

### Frontend Setup
- [ ] Installed @paypal/react-paypal-js
- [ ] Updated BookingPage component
- [ ] Added PayPal button integration
- [ ] Added payment step UI
- [ ] Added payment CSS styles
- [ ] Configured PayPal Client ID in .env
- [ ] Started frontend server

### Testing
- [ ] Created PayPal sandbox accounts
- [ ] Tested complete booking flow
- [ ] Verified payment creation
- [ ] Verified booking confirmation
- [ ] Checked user payment history
- [ ] Checked owner received payments
- [ ] Tested payment cancellation
- [ ] Tested payment errors

### Production Ready
- [ ] Switched to production credentials
- [ ] Enabled HTTPS
- [ ] Tested with real accounts
- [ ] Configured error monitoring
- [ ] Set up payment notifications
- [ ] Defined refund policy

---

**Document Version:** 1.0  
**Last Updated:** October 16, 2025  
**Status:** Ready for Testing  
**Next Steps:** Configure PayPal credentials and test payment flow
