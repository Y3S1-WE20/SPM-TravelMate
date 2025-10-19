# TravelMate – Complete Travel Booking Platform

**Department of Software Engineering**  
**Faculty of Computing**  
**Sri Lanka Institute of Information Technology (SLIIT)**

---

## 🌟 Project Overview

**TravelMate** is a comprehensive travel booking platform built with modern web technologies, featuring property rentals, vehicle reservations, secure payments, and role-based user management. The platform serves three types of users: travelers, hotel owners, and administrators, providing a seamless experience for booking accommodations and transportation.

**Course:** SE3080 - Software Project Management  
**Year 3 – Semester 1, 2025**  
**Group ID:** WE20

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** with three user types:
  - **Travelers** (Regular users who can book properties and vehicles)
  - **Hotel Owners** (Can list and manage properties, view bookings and earnings)
  - **Administrators** (Full system access, user management, content moderation)

### 🏨 Property Management System
- **Property Listings** with image uploads (up to 10 images per property)
- **Advanced Filtering** by location, price, amenities, and status
- **Approval Workflow** - Properties require admin approval before going live
- **Owner Dashboard** - Manage properties, view bookings, track earnings
- **Property Statistics** - Comprehensive analytics for owners and admins

### 🚗 Vehicle Rental System
- **Vehicle Listings** with image uploads and detailed specifications
- **Reservation Management** with date-based availability
- **Admin Oversight** for vehicle management and reservation approvals
- **Real-time Availability** checking and booking

### 💳 Payment Integration
- **PayPal Sandbox Integration** for secure payments
- **Order Creation & Capture** workflow
- **Payment History** tracking for users and property owners
- **Revenue Analytics** for property owners

### ⭐ Review & Rating System
- **Property Reviews** with star ratings
- **User Review Management** - Create, update, delete reviews
- **Review Analytics** - Helpful votes and statistics
- **Review Moderation** by administrators

### 📊 Admin Dashboard
- **User Management** - View, manage, and moderate users
- **Content Moderation** - Approve/reject properties and reviews
- **System Analytics** - Comprehensive statistics and insights
- **Booking Management** - Oversee all bookings and reservations
- **Revenue Tracking** - System-wide financial analytics

### 🎨 Modern UI/UX
- **Responsive Design** built with React
- **Smooth Animations** using Framer Motion
- **Intuitive Navigation** with React Router
- **Mobile-First Approach** for all devices

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animation library
- **React Icons & Lucide React** - Icon libraries
- **PayPal React SDK** - Payment integration
- **CSS3** - Custom styling with modern CSS features

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - NoSQL database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### DevOps & Quality
- **ESLint** - Code linting and quality
- **Jest** - Unit testing framework
- **GitHub Actions** - CI/CD pipelines
- **Vercel** - Frontend deployment platform

---

## 🚀 Deployment & CI/CD

### Frontend Deployment
- **Platform:** Vercel
- **URL:** [Live Application](https://spm-travel-mate.vercel.app/)
- **Build Process:** Automated deployment on push to main branch
- **Environment:** Production-ready with optimized builds

### CI/CD Pipeline
- **GitHub Actions** workflows for automated testing and deployment
- **Code Quality Checks** - ESLint, Prettier integration
- **Automated Testing** - Jest test suite execution
- **Build Verification** - Production build validation
- **Deployment Automation** - Seamless frontend deployment

---

## 📁 Project Structure

```
TravelMate/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── pages/           # Page components
│   │   └── App.js           # Main application component
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── controllers/         # Business logic controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API route definitions
│   ├── uploads/             # File upload storage
│   └── server.js            # Main server file
├── docs/                    # Documentation
└── README.md               # Project documentation
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Git**

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm run dev           # Start development server
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Configure environment variables
npm start             # Start development server
```

### Environment Variables

#### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/travelmate
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_PAYPAL_CLIENT_ID=your-paypal-client-id
```

---

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Properties
- `GET /properties/public` - Get approved properties
- `GET /properties` - Get all properties (admin)
- `POST /properties` - Create property (hotel owner)
- `PUT /properties/:id` - Update property
- `PATCH /properties/:id/status` - Update property status (admin)

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - Get bookings (admin)
- `PATCH /bookings/:id/status` - Update booking status
- `DELETE /bookings/:id` - Delete booking

### Payments
- `POST /payments/create-order` - Create PayPal order
- `POST /payments/capture/:orderId` - Capture payment
- `GET /payments/user/:userId` - Get user payments

### Vehicles
- `GET /vehicles` - Get available vehicles
- `POST /vehicles/:id/reserve` - Reserve vehicle
- `GET /vehicles/reservations/all` - Get all reservations (admin)

### Reviews
- `POST /reviews` - Create review
- `GET /reviews/property/:propertyId` - Get property reviews
- `PUT /reviews/:reviewId` - Update review
- `DELETE /reviews/:reviewId` - Delete review

---

## 🎯 User Roles & Permissions

### Traveler (User)
- ✅ Browse and search properties
- ✅ Book properties and vehicles
- ✅ Make payments via PayPal
- ✅ Leave reviews and ratings
- ✅ View booking history
- ✅ Manage profile

### Hotel Owner
- ✅ All traveler permissions
- ✅ List and manage properties
- ✅ Upload property images
- ✅ View property bookings
- ✅ Track earnings and analytics
- ✅ Manage booking statuses

### Administrator
- ✅ All permissions
- ✅ User management and moderation
- ✅ Approve/reject properties
- ✅ System-wide analytics
- ✅ Content moderation
- ✅ Manage all bookings and reservations

---

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if implemented)
cd backend
npm test
```

### Test Coverage
- **Unit Tests** - Component and utility function testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - User flow testing (planned)

---

## 📈 Scrum Execution & Agile Practices

### Sprint Structure
- **Sprint 1:** Project setup, authentication, basic UI
- **Sprint 2:** Property management, booking system
- **Sprint 3:** Payment integration, vehicle rentals
- **Sprint 4:** Admin dashboard, reviews, final polish

### Scrum Artifacts
- **Product Backlog:** Comprehensive feature list with priorities
- **Sprint Backlog:** Detailed tasks for each sprint
- **Burndown Charts:** Progress tracking and velocity measurement
- **Definition of Done:** Clear acceptance criteria for all features

### Tools Used
- **Jira/Trello:** Project management and sprint planning
- **GitHub:** Version control and collaboration
- **Slack/MS Teams:** Communication and stand-ups
- **Google Meet:** Sprint reviews and retrospectives

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Quality Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 Documentation

- **API Documentation:** Postman collection available
- **User Guide:** Step-by-step user manuals
- **Developer Guide:** Setup and contribution guidelines
- **Architecture Diagrams:** System design documentation

---

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcryptjs
- **Input Validation** and sanitization
- **CORS Configuration** for secure API access
- **Role-based Access Control** throughout the application
- **Secure File Upload** with type validation

---

## 📞 Support & Contact

**Project Team:** WE20  
**Course:** SE3080 - Software Project Management  
**Institution:** Sri Lanka Institute of Information Technology  

For technical support or questions, please create an issue in the repository.

---

## 📚 References & Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Node.js Documentation](https://nodejs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [PayPal Developer Documentation](https://developer.paypal.com/)
- [Agile Manifesto](https://agilemanifesto.org/)
- [Scrum Guide](https://scrumguides.org/)

---

## 📄 License

This project is developed as part of an academic assignment and is not licensed for commercial use.

---

*Built with ❤️ by WE20 Team - SLIIT Software Engineering*