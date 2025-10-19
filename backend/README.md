# TravelMate Backend API

A robust Node.js/Express backend API for the TravelMate travel booking platform, featuring JWT authentication, role-based access control, and comprehensive booking management.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Three user roles (user, hotel owner, admin)
- **Property Management** - CRUD operations with image uploads
- **Booking System** - Complete booking lifecycle management
- **Payment Integration** - PayPal sandbox payment processing
- **Vehicle Rental** - Vehicle listing and reservation system
- **Review System** - Property reviews and ratings
- **File Upload** - Image upload handling with Multer
- **MongoDB Integration** - NoSQL database with Mongoose ODM

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📦 Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/travelmate
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PAYPAL_CLIENT_ID=your-paypal-sandbox-client-id
   PAYPAL_CLIENT_SECRET=your-paypal-sandbox-client-secret
   PAYPAL_MODE=sandbox
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running locally or configure a cloud MongoDB URI

5. **Start the server**
   ```bash
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```

   The API will be available at [http://localhost:5001](http://localhost:5001)

## 📊 API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)
- `PUT /auth/profile` - Update user profile (protected)

### Properties (`/properties`)
- `GET /properties/public` - Get approved properties
- `GET /properties` - Get all properties (admin)
- `POST /properties` - Create property (hotel owner)
- `GET /properties/:id` - Get property by ID
- `PUT /properties/:id` - Update property
- `PATCH /properties/:id/status` - Update property status (admin)
- `DELETE /properties/:id` - Delete property
- `GET /properties/owner/:ownerId` - Get properties by owner
- `GET /properties/stats/summary` - Get property statistics

### Bookings (`/bookings`)
- `POST /bookings` - Create booking
- `GET /bookings` - Get all bookings (admin)
- `GET /bookings/:id` - Get booking by ID
- `PATCH /bookings/:id/status` - Update booking status
- `DELETE /bookings/:id` - Delete booking
- `GET /bookings/stats/summary` - Get booking statistics

### Payments (`/payments`)
- `POST /payments/create-order` - Create PayPal order
- `POST /payments/capture/:orderId` - Capture PayPal payment
- `POST /payments/complete` - Complete payment notification
- `GET /payments/:paymentId` - Get payment details
- `GET /payments/user/:userId` - Get user payments
- `GET /payments/owner/:ownerId` - Get owner payments

### Vehicles (`/vehicles`)
- `GET /vehicles` - Get all vehicles
- `POST /vehicles` - Create vehicle (admin)
- `GET /vehicles/:id` - Get vehicle by ID
- `POST /vehicles/:id/reserve` - Reserve vehicle
- `GET /vehicles/reservations/all` - Get all reservations (admin)
- `PUT /vehicles/reservations/:id/status` - Update reservation status

### Reviews (`/reviews`)
- `POST /reviews` - Create review
- `GET /reviews/property/:propertyId` - Get property reviews
- `GET /reviews/user/:userId` - Get user reviews
- `GET /reviews/stats/:propertyId` - Get review statistics
- `PUT /reviews/:reviewId` - Update review
- `DELETE /reviews/:reviewId` - Delete review
- `POST /reviews/:reviewId/helpful` - Mark review as helpful

## 🎯 User Roles & Permissions

### User (Traveler)
- Register and login
- Browse properties and vehicles
- Create bookings and reservations
- Make payments
- Leave reviews
- View personal booking history

### Hotel Owner
- All user permissions
- Create and manage properties
- Upload property images
- View property bookings
- Update booking statuses
- Access earnings analytics

### Admin
- All permissions across the system
- User management and moderation
- Approve/reject properties
- System-wide analytics
- Content moderation
- Manage all bookings and reservations

## 🗂️ Project Structure

```
backend/
├── controllers/          # Business logic controllers
│   ├── bookingController.js
│   ├── paymentController.js
│   ├── propertyController.js
│   ├── reviewController.js
│   ├── userController.js
│   └── vehicleController.js
├── middleware/           # Custom middleware
│   └── upload.js        # File upload configuration
├── models/              # MongoDB models
│   ├── Booking.js
│   ├── Payment.js
│   ├── Property.js
│   ├── Review.js
│   ├── User.js
│   └── Vehicle.js
├── routes/              # API route definitions
│   ├── auth.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   ├── propertyRoutes.js
│   ├── reviewRoutes.js
│   └── vehicleRoutes.js
├── uploads/             # File upload storage
├── server.js           # Main server file
├── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication** with secure token validation
- **Password Hashing** using bcryptjs
- **Role-based Middleware** for access control
- **Input Validation** on all endpoints
- **CORS Configuration** for secure API access
- **File Upload Security** with type validation

## 🧪 Testing

```bash
npm test  # Run test suite (when implemented)
```

## 📚 API Documentation

### Postman Collection
Import the `TravelMate API.postman_collection.json` file for complete API documentation with example requests.

### Authentication
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
PAYPAL_MODE=live  # For production payments
```

### Build & Deploy
```bash
npm run build  # If using a build process
npm start
```

## 🤝 Contributing

1. Follow existing code structure
2. Add proper error handling
3. Include input validation
4. Update API documentation
5. Test all endpoints

## 📞 Support

For API-related issues or questions, please check:
- API documentation
- Error logs
- Postman collection examples

## 📄 License

This project is developed as part of an academic assignment.

---

*Built with Node.js & Express - Part of TravelMate Platform*