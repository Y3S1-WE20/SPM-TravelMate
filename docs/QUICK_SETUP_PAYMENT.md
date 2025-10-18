# Quick Setup - PayPal Payment Integration

## ⚡ Installation (5 minutes)

### 1. Install Frontend Package

```powershell
cd F:\SPM-TravelMate\frontend
npm install @paypal/react-paypal-js
```

### 2. Get PayPal Sandbox Credentials

1. Go to https://developer.paypal.com/
2. Log in (create account if needed)
3. Go to **My Apps & Credentials**
4. Click **Create App**
   - Name: `TravelMate-Sandbox`
   - Type: Merchant
5. Copy **Client ID** and **Secret**

### 3. Configure Backend Environment

Edit `F:\SPM-TravelMate\backend\.env`:

```env
# Add these lines:
PAYPAL_CLIENT_ID=<paste_your_client_id>
PAYPAL_CLIENT_SECRET=<paste_your_secret>
PAYPAL_MODE=sandbox
FRONTEND_URL=http://localhost:3000
```

### 4. Configure Frontend Environment

Create `F:\SPM-TravelMate\frontend\.env`:

```env
REACT_APP_PAYPAL_CLIENT_ID=<paste_your_client_id>
```

⚠️ **Use the SAME Client ID in both files!**

### 5. Restart Servers

**Backend:**
```powershell
cd F:\SPM-TravelMate\backend
# Press Ctrl+C to stop if running
npm start
```

**Frontend:**
```powershell
cd F:\SPM-TravelMate\frontend
# Press Ctrl+C to stop if running
npm start
```

---

## ✅ Test Payment Flow

1. Open http://localhost:3000
2. Find a property and click "Book Now"
3. Select dates and fill in guest information
4. Click "Proceed to Payment"
5. Click the **PayPal** button
6. Log in with PayPal sandbox account:
   - Go to https://developer.paypal.com/dashboard
   - Click "Sandbox → Accounts"
   - Copy **Personal Account** email and click "View/Edit"
   - Use these credentials to log in
7. Approve payment
8. Check your dashboard - booking should be confirmed!

---

## 🎯 What You Get

### User Experience
✅ 3-step booking process (Dates → Info → Payment)  
✅ Secure PayPal payment  
✅ Automatic booking confirmation  
✅ Payment history in user dashboard  

### Hotel Owner Benefits
✅ Automatic payment notifications  
✅ 95% payout (5% platform fee)  
✅ Payment tracking in owner dashboard  
✅ Total earnings calculator  

### Database Records
✅ Payment transactions saved  
✅ Booking status updated to "confirmed"  
✅ User payment history updated  
✅ Owner received payments tracked  

---

## 🔍 Verify Everything Works

### Check Database

**Using MongoDB Compass:**
1. Connect to your MongoDB
2. Open `travelmateDB` database
3. Check these collections:

**payments:**
```javascript
{
  status: "completed",
  amount: 150.00,
  ownerPayout: 142.50,
  platformFee: 7.50
}
```

**bookings:**
```javascript
{
  status: "confirmed"  // Changed from "pending"
}
```

**users (guest):**
```javascript
{
  paymentHistory: [{
    amount: 150.00,
    status: "completed"
  }]
}
```

**users (hotel owner):**
```javascript
{
  receivedPayments: [{
    amount: 142.50
  }],
  totalEarnings: 142.50
}
```

---

## 🐛 Troubleshooting

### PayPal Button Not Showing?
1. Check `.env` files have correct credentials
2. Restart servers
3. Check browser console for errors
4. Verify `REACT_APP_PAYPAL_CLIENT_ID` is set

### Payment Fails?
1. Check you're using **Sandbox** credentials
2. Verify `PAYPAL_MODE=sandbox` in backend `.env`
3. Check backend console for errors
4. Ensure booking was created first

### Booking Not Confirmed?
1. Check payment was captured successfully
2. Verify backend console shows "Payment captured"
3. Check database payment status is "completed"
4. Refresh dashboard page

---

## 📚 Full Documentation

For detailed guide, see:
- **Complete Guide:** `/docs/PAYPAL_INTEGRATION_GUIDE.md`
- **Feedback System:** `/docs/FEEDBACK_SYSTEM_GUIDE.md`

---

## 💰 Commission Structure

- **Booking Total:** 100%
- **Platform Fee:** 5%
- **Owner Payout:** 95%

Example: $100 booking = $5 platform + $95 to owner

---

## 🚀 Next Steps

After testing:
1. [ ] Configure email notifications
2. [ ] Add refund functionality
3. [ ] Create owner payout dashboard
4. [ ] Set up payment analytics
5. [ ] Prepare for production deployment

---

**Need Help?**
- Check `/docs/PAYPAL_INTEGRATION_GUIDE.md` for complete documentation
- PayPal Developer Support: https://developer.paypal.com/support/

**Status:** ✅ Ready to Test  
**Last Updated:** October 16, 2025
