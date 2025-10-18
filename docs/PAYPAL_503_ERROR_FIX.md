# PayPal 503 Error - Troubleshooting Guide

## Error Description
```
Failed to load resource: the server responded with a status of 503 ()
Failed to load the PayPal JS SDK script
```

## Common Causes & Solutions

### 1. ✅ Invalid or Expired PayPal Client ID

**Problem:** The PayPal client ID in your `.env` file might be invalid, expired, or from a deleted sandbox account.

**Solution:**
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in with your PayPal account
3. Navigate to **Apps & Credentials**
4. Make sure you're in **Sandbox** mode (toggle at top)
5. Create a new app or use an existing one
6. Copy the **Client ID** from your app
7. Update `frontend/.env`:
   ```
   REACT_APP_PAYPAL_CLIENT_ID=your_new_client_id_here
   ```
8. Update `backend/.env`:
   ```
   PAYPAL_CLIENT_ID=your_new_client_id_here
   PAYPAL_CLIENT_SECRET=your_client_secret_here
   ```

### 2. 🌐 Network/Firewall Issues

**Problem:** Your network, VPN, or firewall might be blocking access to PayPal's servers.

**Solution:**
- Disable VPN if you're using one
- Check if your antivirus/firewall is blocking PayPal
- Try a different network connection
- Check if `https://www.paypal.com` is accessible in your browser

### 3. 🏦 PayPal Sandbox Service Down

**Problem:** PayPal's sandbox environment might be temporarily unavailable.

**Solution:**
- Check [PayPal Status Page](https://www.paypal-status.com/)
- Wait a few minutes and try again
- Try at a different time of day

### 4. 🔑 Incorrect Sandbox Account Setup

**Problem:** Your sandbox account might not be properly configured.

**Solution:**

#### Step 1: Create/Verify Sandbox Accounts
1. Go to [PayPal Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
2. Create two test accounts:
   - **Personal Account** (Buyer) - for testing purchases
   - **Business Account** (Seller) - for receiving payments
3. Note down the email and password for both accounts

#### Step 2: Create a New App
1. Go to **Apps & Credentials**
2. Click **Create App**
3. Enter App Name (e.g., "TravelMate-Sandbox")
4. Select the **Business Account** as the sandbox account
5. Click **Create App**

#### Step 3: Get Credentials
1. Copy the **Client ID**
2. Click **Show** under **Secret** and copy it
3. Update your `.env` files with these credentials

### 5. 🔄 Browser Cache Issues

**Problem:** Cached PayPal SDK causing conflicts.

**Solution:**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh the page (Ctrl + F5)
3. Try incognito/private browsing mode
4. Restart your browser

### 6. 🔧 Configuration Issues

**Problem:** PayPal options might be misconfigured.

**Current Configuration Check:**
```javascript
// In BookingPage.jsx
const paypalOptions = {
  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture"
};
```

**Things to Verify:**
- Client ID is exactly as shown in PayPal dashboard (no extra spaces)
- Using **Sandbox** credentials, not Production
- `.env` file is in the correct location (`frontend/.env`)
- Restart frontend after changing `.env` file

## Quick Fix Steps (In Order)

### Step 1: Verify Environment Variables
```bash
# In frontend/.env
REACT_APP_PAYPAL_CLIENT_ID=AX1KBbsivlkq_zeesu8D_CHRF2Mpl0rYLTJMutwl0bUnb4JK5tcRbPeqYXDZ3DM-PAjeG5EyRhPWKhaX

# In backend/.env
PAYPAL_CLIENT_ID=AX1KBbsivlkq_zeesu8D_CHRF2Mpl0rYLTJMutwl0bUnb4JK5tcRbPeqYXDZ3DM-PAjeG5EyRhPWKhaX
PAYPAL_CLIENT_SECRET=your_secret_here
PAYPAL_MODE=sandbox
```

### Step 2: Restart Servers
```bash
# Kill both servers (Ctrl+C)
# Restart backend
cd backend
npm start

# Restart frontend (in new terminal)
cd frontend
npm start
```

### Step 3: Clear Browser Data
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Step 4: Test PayPal Access
Open browser console and run:
```javascript
console.log('Client ID:', process.env.REACT_APP_PAYPAL_CLIENT_ID);
```

### Step 5: Create Fresh Sandbox App
If all else fails:
1. Delete old sandbox app in PayPal dashboard
2. Create a brand new sandbox app
3. Get new credentials
4. Update both `.env` files
5. Restart both servers

## Alternative: Test Without PayPal

If you need to test the booking flow without PayPal working:

1. **Comment out PayPal** in `BookingPage.jsx`:
```javascript
// Temporary: Manual payment confirmation
const createOrder = async (data, actions) => {
  try {
    const confirmed = window.confirm(
      `Test Mode: Confirm payment of $${(totalCost / 300).toFixed(2)} USD?`
    );
    if (confirmed) {
      // Simulate successful payment
      const response = await axios.post('http://localhost:5001/api/bookings/confirm', {
        bookingId: currentBookingId
      });
      if (response.data.success) {
        alert('Booking confirmed!');
        navigate('/dashboard');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

2. **Add confirmation endpoint** in backend (temporary testing)

## Checking If It's Working

### Good Signs ✅
- PayPal buttons appear on Step 3
- Clicking shows PayPal login screen
- Can log in with sandbox account
- Can complete payment

### Bad Signs ❌
- 503 error in console
- Buttons don't load
- Red error message
- "Failed to load SDK" message

## Still Not Working?

### Contact PayPal Support
- [PayPal Developer Forums](https://www.paypal-community.com/t5/Developer-Technical/bd-p/dt-technical)
- [PayPal Developer Support](https://developer.paypal.com/support/)

### Use This Information When Asking for Help:
```
Error: 503 when loading PayPal SDK
URL: https://www.paypal.com/sdk/js?client-id=xxx&currency=USD&intent=capture
Environment: Sandbox
Framework: React with @paypal/react-paypal-js
PayPal Client ID: [First 10 characters only]
Country: Sri Lanka
Browser: [Your browser name]
```

## Final Notes

- **NEVER** share your full Client ID or Secret in public forums
- **ALWAYS** use Sandbox credentials for testing
- **Production credentials** should only be used when going live
- Keep your `.env` files out of git (add to `.gitignore`)

---

### Quick Reference: File Locations

```
frontend/.env                     # PayPal Client ID for frontend
backend/.env                      # PayPal credentials for backend
frontend/src/components/BookingPage.jsx  # PayPal integration code
backend/controller/paymentController.js  # Payment processing
```

### Environment Variable Names

| File | Variable | Purpose |
|------|----------|---------|
| `frontend/.env` | `REACT_APP_PAYPAL_CLIENT_ID` | PayPal SDK initialization |
| `backend/.env` | `PAYPAL_CLIENT_ID` | PayPal API authentication |
| `backend/.env` | `PAYPAL_CLIENT_SECRET` | PayPal API authentication |
| `backend/.env` | `PAYPAL_MODE` | `sandbox` or `production` |

---

**Last Updated:** October 16, 2025
**Project:** SPM-TravelMate
**Issue:** PayPal 503 Error Resolution
