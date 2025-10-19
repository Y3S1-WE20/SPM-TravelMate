# TravelMate Frontend

A modern, responsive React application for the TravelMate travel booking platform.

## 🚀 Features

- **Property Browsing & Booking** - Search, filter, and book accommodations
- **Vehicle Rental System** - Reserve vehicles for travel
- **User Authentication** - JWT-based login and registration
- **Role-based Access** - Different dashboards for users, hotel owners, and admins
- **PayPal Integration** - Secure payment processing
- **Review System** - Rate and review properties
- **Responsive Design** - Mobile-first approach with modern UI
- **Real-time Updates** - Live booking status and availability

## 🛠️ Technology Stack

- **React 19** - Latest React with modern hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **Framer Motion** - Smooth animations and transitions
- **PayPal React SDK** - Payment integration
- **React Icons & Lucide React** - Icon libraries
- **CSS3** - Custom responsive styling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Y3S1-WE20/SPM-TravelMate.git
   cd SPM-TravelMate/frontend
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
   REACT_APP_API_URL=http://localhost:5001
   REACT_APP_PAYPAL_CLIENT_ID=your-paypal-sandbox-client-id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
npm test
```

Launches the test runner in interactive watch mode.

## 🚀 Build for Production

```bash
npm run build
```

Builds the app for production to the `build` folder.

## 📱 User Roles

### Traveler
- Browse and search properties
- Book accommodations and vehicles
- Make secure payments
- Leave reviews and ratings
- View booking history

### Hotel Owner
- List and manage properties
- Upload property images
- View bookings and earnings
- Manage booking statuses
- Access analytics dashboard

### Administrator
- Full system access
- User and content moderation
- Approve/reject properties
- System-wide analytics
- Manage all bookings

## 🎨 UI Components

The application includes various reusable components:

- **PropertyCard** - Property listing display
- **BookingPage** - Booking interface
- **AdminDashboard** - Administrative controls
- **Header** - Navigation component
- **AuthContext** - Authentication state management

## 🔧 Development Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App (irreversible)

## 🌐 Deployment

The frontend is deployed on **Vercel** with automatic deployments from the main branch.

**Live URL:** [https://your-app-url.vercel.app](https://your-app-url.vercel.app)

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Ensure responsive design
4. Test across different browsers
5. Follow React best practices

## 📚 Related Projects

- **Backend API** - [Backend Repository](../backend)
- **Full Documentation** - [Main README](../README.md)

---

*Part of the TravelMate platform - Built with React & ❤️*
