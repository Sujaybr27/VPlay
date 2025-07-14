# VPlay - Smart Court Booking Platform

A modern web application for booking sports courts with real-time availability and secure payment processing.

## Features

- **Multi-Sport Support**: Badminton, Cricket, Tennis, Football
- **Real-time Booking**: Instant court availability and booking
- **User Management**: Registration, login with Google OAuth support
- **Admin Dashboard**: Manage locations, courts, and bookings
- **Location Owner Portal**: Add and manage sports facilities
- **Secure Payments**: Multiple payment methods (Card, UPI, Wallets)
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- Node.js with Express
- Prisma ORM with SQLite database
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Google OAuth integration

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Server runs on http://localhost:5050

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

### Database Setup
The SQLite database is already seeded with sample data:
- Test user: test@vplay.com (password: password)
- Location owner: owner@vplay.com (password: password)

## Project Structure

```
VPlay/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   └── index.js         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Sample data
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/          # Page components
    │   ├── contexts/       # React contexts
    │   └── api.js          # API configuration
    └── package.json
```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/locations` - Get all locations
- `GET /api/courts` - Get all courts
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:id` - Get user bookings

## Demo Accounts

- **Regular User**: test@vplay.com / password
- **Admin/Owner**: owner@vplay.com / password

## Development Status

✅ Backend API with authentication
✅ Database with sample data
✅ Frontend with responsive design
✅ Booking flow implementation
✅ Admin and location owner portals
⚠️ Google OAuth (requires configuration)
⚠️ Payment integration (demo mode)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License