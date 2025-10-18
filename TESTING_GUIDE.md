# Payment Testing Guide

## ✅ All Fixes Applied

1. **Property ID validation** - Prevents errors from PayPal redirect URLs
2. **PayPal SDK loading** - Buttons now display correctly
3. **Payment capture handling** - Accepts frontend-captured payments
4. **Required field validation** - Proper property owner and property ID handling
5. **Booking status update** - Changes to "confirmed" after payment
6. **Mongoose index warning** - Fixed duplicate index definition

## 🧪 How to Test Payment Flow

### Step 1: Prepare
1. Make sure backend is running on port 5001 ✅
2. Make sure frontend is running on port 3000
3. Clear browser cache (Ctrl + Shift + Delete)
4. Open browser console (F12) to see logs

### Step 2: Create Booking
1. Log in as a traveller
2. Browse properties and select one
3. Click "Book Now"
4. Fill in Step 1: Availability Details
   - Select check-in date (future date)
   - Select check-out date (at least 1 day after check-in)
   - Set number of rooms
   - Set adults and children
5. Click "Continue to Personal Info"

### Step 3: Personal Information
1. Fill in all required fields:
   - First Name
   - Last Name
   - Email
   - Country
   - Phone Number
2. Select preferences
3. Click "Proceed to Payment"

### Step 4: PayPal Payment
1. You should see PayPal buttons (not "Loading PayPal...")
2. Click on the PayPal button
3. Log in to PayPal sandbox account
4. Complete the payment

### Step 5: Payment Completion
1. After payment, you should see:
   - "Payment successful!" alert
   - Redirect to dashboard
2. Check dashboard - booking should show as "confirmed"

## 🔍 What to Check in Console

### Frontend Console Should Show:
```
✅ PropertyID from URL: [valid ObjectId]
✅ Fetching property with ID: [valid ObjectId]
✅ Property response: Object
✅ PayPal Client ID: Present
✅ window.paypal available: true
✅ onApprove payload: Object
✅ PayPal capture details: Object (status: COMPLETED)
✅ Sending to backend: Object
✅ Backend completion response: { success: true, ... }
```

### Backend Console Should Show:
```
✅ Creating PayPal order for bookingId: ... amount: ...
✅ PayPal access token generated successfully
✅ PayPal order created: [orderId]
✅ [COMPLETE] Received payment completion payload
✅ Using capture details from frontend, status: COMPLETED
✅ Booking found: ...
✅ Property found: ...
✅ Payment saved with id: ...
✅ Booking status updated to confirmed
✅ User payment history updated
✅ Owner payment history updated
```

## ❌ Common Issues and Solutions

### Issue 1: "Loading PayPal..." stuck
- **Cause**: Client ID missing or invalid
- **Solution**: Check REACT_APP_PAYPAL_CLIENT_ID in frontend .env

### Issue 2: "Property owner information is missing"
- **Cause**: Property has no ownerId field
- **Solution**: Check property in database, ensure ownerId is set

### Issue 3: Payment successful but booking still pending
- **Cause**: Backend update failed
- **Solution**: Check backend logs for errors, check MongoDB connection

### Issue 4: Manifest icon error
- **Cause**: Browser cache
- **Solution**: Hard refresh (Ctrl + Shift + R) or clear cache

## 📊 Database Verification

After successful payment, check MongoDB:

### Bookings Collection
```javascript
db.bookings.findOne({ _id: ObjectId("your_booking_id") })
// Should show: status: "confirmed"
```

### Payments Collection
```javascript
db.payments.findOne({ paypalOrderId: "your_order_id" })
// Should show: 
// - status: "completed"
// - bookingId: [valid ObjectId]
// - propertyOwnerId: [valid ObjectId]
// - propertyId: [valid ObjectId]
// - paymentDate: [Date]
// - paypalPaymentId: [capture ID]
```

### Users Collection (Traveller)
```javascript
db.users.findOne({ _id: ObjectId("user_id") })
// Check paymentHistory array for new payment entry
```

### Users Collection (Owner)
```javascript
db.users.findOne({ _id: ObjectId("owner_id") })
// Check receivedPayments array for new payment entry
// Check totalEarnings increased
```

## 🎯 Success Criteria

- [ ] PayPal buttons display immediately (no "Loading..." stuck)
- [ ] Payment completes successfully in PayPal
- [ ] No errors in frontend console
- [ ] No errors in backend console
- [ ] Booking status changes to "confirmed"
- [ ] Payment record created in database
- [ ] User payment history updated
- [ ] Owner earnings updated
- [ ] User redirected to dashboard
- [ ] Success alert displayed

## 📝 PayPal Sandbox Test Accounts

### Buyer Account (Traveller)
- Email: Your sandbox personal account
- Password: Your sandbox password

### Seller Account (Business - receives payment)
- Automatically configured via PAYPAL_CLIENT_ID
- Should be: sb-6249r44976644@business.example.com

## 🐛 Debug Mode

To enable more detailed logging:

### Frontend (`BookingPage.jsx`)
All console.log statements are already enabled

### Backend (`paymentController.js`)
All console.log statements are already enabled

Check the logs for the complete payment flow!

## 🚀 Next Test

Try booking again with the updated code. You should see:
1. ✅ PayPal buttons load immediately
2. ✅ Payment completes successfully
3. ✅ Booking status updates to "confirmed"
4. ✅ No more "ORDER_ALREADY_CAPTURED" errors
5. ✅ Clean redirect to dashboard
