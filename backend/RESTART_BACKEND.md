# ⚠️ BACKEND SERVER RESTART REQUIRED

## Issue
Getting **404 error** when clicking PayPal button:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
http://localhost:5001/api/payments/create-order
```

## Root Cause
The payment routes were added to `server.js` but the backend server is still running the OLD code without these routes.

## ✅ Solution - Restart Backend Server

### Option 1: Using Terminal (Recommended)
1. **Stop the backend server:**
   - Find the terminal running `node server.js` or `npm start`
   - Press `Ctrl + C` to stop it

2. **Start the backend server again:**
   ```powershell
   cd F:\SPM-TravelMate\backend
   npm start
   ```
   
   OR for development with auto-restart:
   ```powershell
   npm run dev
   ```

### Option 2: Kill Process Manually
If you can't find the terminal:

1. **Open PowerShell as Administrator**

2. **Find the process using port 5001:**
   ```powershell
   netstat -ano | findstr :5001
   ```

3. **Kill the process** (replace PID with the number from previous command):
   ```powershell
   taskkill /PID <PID> /F
   ```

4. **Start backend again:**
   ```powershell
   cd F:\SPM-TravelMate\backend
   npm start
   ```

## ✅ Verification

After restarting, you should see:
```
Server running on port 5001
MongoDB connected successfully!
```

### Test Payment Endpoint
Open browser or use PowerShell:
```powershell
curl http://localhost:5001/api/payments/create-order
```

Should return an error (since no data sent), but NOT 404:
```json
{
  "success": false,
  "message": "Booking not found"
}
```

## 🎯 Next Steps

1. ✅ Restart backend server (see above)
2. ✅ Keep frontend running (React on port 3000)
3. ✅ Try booking again
4. ✅ Click PayPal button - should work now!

## 📝 Note for Future

**Always restart the backend server when you:**
- Add new routes
- Modify route files
- Change environment variables in `.env`
- Install new npm packages that affect server code
- Modify middleware or controllers

**Auto-restart tip:** Use `npm run dev` instead of `npm start` - it uses nodemon which automatically restarts on file changes!
