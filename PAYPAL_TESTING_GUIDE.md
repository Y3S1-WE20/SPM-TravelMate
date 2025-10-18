# PayPal Integration Testing Guide

## 🎯 Overview
This guide will help you test the PayPal payment integration for TravelMate.

## ✅ Backend Fixes Applied

### 1. **Enhanced Token Generation** (`generateAccessToken()`)
- ✅ Added credential trimming to prevent whitespace issues
- ✅ Added validation for missing credentials
- ✅ Added `response.ok` check before parsing JSON
- ✅ Enhanced error logging with status codes and error details
- ✅ Validates access_token exists in response

### 2. **Improved Order Creation** (`createPayPalOrder()`)
- ✅ Better logging for successful order creation
- ✅ Enhanced retry mechanism with detailed logging
- ✅ Logs PayPal API response status on both success and failure

### 3. **Server Startup Logging**
- ✅ Displays PayPal configuration on startup
- ✅ Shows mode (sandbox/production), API base URL, and partial credentials

---

## 🚀 Testing Steps

### Step 1: Test PayPal Credentials

Open a PowerShell terminal in the backend directory:

```powershell
cd F:\SPM-TravelMate\backend
node testPayPalCredentials.js
```

**Expected Output:**
```
🔍 Testing PayPal Credentials...

Client ID (first 10 chars): AX1KBbsivl
API Base URL: https://api-m.sandbox.paypal.com
Mode: sandbox

---

1️⃣ Testing PayPal API connection...
Response Status: 200
Response Status Text: OK

✅ SUCCESS! PayPal credentials are valid!
Access Token (first 20 chars): A21AAK...
Token Type: Bearer
Expires In: 32400 seconds

🎉 Your PayPal integration should work!

✅ You can proceed with testing payments!
```

**If Failed:**
- Check your `.env` file for correct credentials
- Ensure no trailing spaces in credentials
- Verify you're using SANDBOX credentials from https://developer.paypal.com/dashboard/

---

### Step 2: Start the Backend Server

```powershell
cd F:\SPM-TravelMate\backend
npm start
```

**Expected Startup Logs:**
```
Server running on port 5001
MongoDB connected successfully!
Routes mounted: /auth, /api/properties, /api/bookings, /api/users, /api/reviews, /api/payments
PayPal Configuration:
  - Mode: sandbox
  - Client ID: AX1KBbsivl...
  - Client Secret: ***8YMh
  - API Base: https://api-m.sandbox.paypal.com
PayPal payment integration: ENABLED
```

**Verify:**
- ✅ PayPal Mode is `sandbox`
- ✅ Client ID matches your dashboard (first 10 chars)
- ✅ "PayPal payment integration: ENABLED" appears

---

### Step 3: Start the Frontend

Open a **new** PowerShell terminal:

```powershell
cd F:\SPM-TravelMate\frontend
npm start
```

The frontend should open at `http://localhost:3000` (or `http://localhost:3001`)

---

### Step 4: Test Payment Flow

1. **Navigate to a property** and click "Book Now"
2. **Fill in booking details** (dates, guest info)
3. **Proceed to payment step**

#### Watch Backend Logs

When you reach the payment step, the backend should log:

```
2025-10-18T... - POST /api/payments/create-order
Request body: {
  "bookingId": "...",
  "amount": 90000
}
✅ PayPal access token generated successfully
Converting 90000 LKR to 300.00 USD
✅ PayPal order created: 8XY12345ABC67890D
```

#### Frontend Behavior

**Option A: PayPal SDK Buttons Load**
- You should see PayPal buttons (yellow "PayPal" button, blue "Debit or Credit Card" button)
- Click the PayPal button
- Log in with your PayPal sandbox buyer account
- Complete the payment
- You'll be redirected back to the app

**Option B: SDK Fails to Load (Fallback)**
- You should see a "Pay on PayPal" button
- Click it to be redirected to PayPal's hosted checkout
- Complete payment and return

---

### Step 5: Test Payment Capture

After completing payment on PayPal:

#### Watch Backend Logs

```
2025-10-18T... - POST /api/payments/capture/8XY12345ABC67890D
✅ PayPal access token generated successfully
✅ Payment captured successfully
Booking status updated to confirmed
```

#### Verify in Database

Check that:
- ✅ Payment record created with `status: 'completed'`
- ✅ Booking status updated to `'confirmed'`
- ✅ User payment history updated
- ✅ Property owner receivedPayments updated

---

## 🧪 Manual API Testing

### Test Create Order Endpoint

```powershell
# Replace the bookingId with an actual booking ID from your database
$body = @{ bookingId = "68cc41c3f5c8825e89f69a04"; amount = 90000 } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:5001/api/payments/create-order" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 10
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "8XY12345ABC67890D",
    "paymentId": "...",
    "approveUrl": "https://www.sandbox.paypal.com/checkoutnow?token=...",
    "rawOrder": { ... }
  }
}
```

**If 500 Error:**
Check backend logs for detailed error messages. Common issues:
- Invalid booking ID
- Missing property or booking data
- PayPal credential issues (should show detailed error now)

---

## 🐛 Troubleshooting

### Error: "PayPal credentials are not configured properly"

**Solution:** Check `.env` file:
```properties
PAYPAL_CLIENT_ID=AX1KBbsivlkq_zeesu8D_CHRF2Mpl0rYLTJMutwl0bUnb4JK5tcRbPeqYXDZ3DM-PAjeG5EyRhPWKhaX
PAYPAL_CLIENT_SECRET=EEYndtkK5Ni2Kgs5HGzhK9dnGN_8JU_BVbYiNe33-yPlFo4EUC9ysO0ZTERe8oSk88RDg96Xw5nS8YMh
PAYPAL_MODE=sandbox
```

Ensure no extra spaces or newlines.

---

### Error: "PayPal API error: invalid_client"

**Causes:**
- Wrong Client ID or Secret
- Using production credentials in sandbox mode (or vice versa)

**Solution:**
1. Go to https://developer.paypal.com/dashboard/
2. Click "Apps & Credentials"
3. Ensure you're in **SANDBOX** tab
4. Copy the correct Client ID and Secret
5. Update `.env` and restart backend

---

### Error: "Token signature verification failed"

**Causes:**
- System clock is significantly off
- Credentials have invisible whitespace characters
- Transient PayPal API issue

**Solution:**
1. Check system time is correct
2. Re-copy credentials from PayPal dashboard (avoid copy-paste issues)
3. Restart backend (will trim credentials automatically)
4. If still failing, wait 5 minutes and retry (PayPal may have transient issues)

---

### Error: HTTP 500 from create-order

With the new fixes, you should see detailed logs like:

```
PayPal token generation failed: {
  status: 401,
  statusText: 'Unauthorized',
  error: { error: 'invalid_client', error_description: '...' }
}
```

or

```
PayPal order creation failed: {
  status: 400,
  statusText: 'Bad Request',
  error: { name: 'INVALID_REQUEST', message: '...' }
}
```

**Solution:** Read the error message in backend logs and address the specific issue shown.

---

### PayPal SDK Not Loading

**Symptoms:**
- Frontend shows "window.paypal available: false"
- Only fallback "Pay on PayPal" button appears

**Causes:**
- Network issues
- Ad blockers
- Corporate firewall

**Solution:**
- Use the hosted checkout fallback (it works!)
- Disable ad blockers
- Try a different network
- Check browser console for SDK load errors

---

## 📊 Expected Console Output Examples

### Successful Payment Flow

**Backend:**
```
2025-10-18T10:30:00.123Z - POST /api/payments/create-order
Request body: {
  "bookingId": "68cc41c3f5c8825e89f69a04",
  "amount": 90000
}
✅ PayPal access token generated successfully
Converting 90000 LKR to 300.00 USD
✅ PayPal order created: 8XY12345ABC67890D

2025-10-18T10:30:45.456Z - POST /api/payments/capture/8XY12345ABC67890D
✅ PayPal access token generated successfully
Payment captured successfully
Booking status updated to confirmed for 68cc41c3f5c8825e89f69a04
```

**Frontend Console:**
```
Creating PayPal order for booking: 68cc41c3f5c8825e89f69a04
Amount: 90000 LKR
PayPal order created: 8XY12345ABC67890D
Payment approved, capturing...
✅ Payment completed successfully!
```

---

### Failed Token Generation

**Backend:**
```
PayPal token generation failed: {
  status: 401,
  statusText: 'Unauthorized',
  error: {
    error: 'invalid_client',
    error_description: 'Client Authentication failed'
  }
}
Error generating PayPal access token: PayPal API error: invalid_client - Client Authentication failed
```

**Action:** Fix credentials in `.env`

---

## 🎓 PayPal Sandbox Test Accounts

You need two test accounts:
1. **Business Account** (already configured - your credentials)
2. **Personal/Buyer Account** (to test purchasing)

### Create Buyer Account:
1. Go to https://developer.paypal.com/dashboard/
2. Click "Testing Tools" → "Sandbox Accounts"
3. Click "Create Account"
4. Select "Personal" account type
5. Set country to your preference
6. Click "Create"

### Use Buyer Account:
When PayPal checkout opens, use the generated buyer email and password (shown in sandbox accounts list).

---

## ✨ Success Checklist

- [ ] `testPayPalCredentials.js` returns ✅ SUCCESS
- [ ] Backend starts without errors and shows PayPal config
- [ ] Frontend starts and loads booking page
- [ ] Create-order endpoint returns `orderId` and `approveUrl`
- [ ] PayPal SDK buttons appear OR fallback button works
- [ ] Can complete payment in PayPal sandbox
- [ ] Capture endpoint processes payment successfully
- [ ] Booking status changes to 'confirmed'
- [ ] Payment record saved in database
- [ ] No 500 errors in backend logs

---

## 🎯 Next Steps After Testing

Once all tests pass:

1. **Review payment records** in MongoDB to ensure data integrity
2. **Test error scenarios** (insufficient funds, canceled payments)
3. **Test currency conversion** (verify amounts are correct)
4. **Prepare for production** (switch to production credentials when ready)

---

## 📞 Need Help?

If you encounter issues not covered here:

1. **Share backend logs** - Copy the entire backend console output
2. **Share frontend console** - Open browser DevTools, copy Console tab
3. **Check network tab** - Look for failed requests (red entries)
4. **Verify .env values** - Double-check all PayPal variables

---

**Good luck testing! 🚀**
