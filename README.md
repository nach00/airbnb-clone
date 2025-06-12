# 🏠 Airbnb Clone - Full-Stack Web Application

A complete Airbnb clone built with Ruby on Rails and React, featuring property browsing, user authentication, booking management, and Stripe payment integration.

## 🌟 Features

### 🏡 Property Management
- Browse properties with professional UI and pagination
- Detailed property views with photos, descriptions, and amenities
- Property filtering and search functionality
- Responsive design optimized for all devices

### 👤 User Authentication
- Secure user registration and login system
- Session management with encrypted cookies
- Password hashing with BCrypt
- Protected routes and authentication checks

### 📅 Booking System
- Interactive date selection with react-dates calendar
- Guest count selection and validation
- Real-time availability checking
- Booking conflict prevention
- Date validation (no past dates, end date after start date)

### 💳 Payment Processing
- Full Stripe Checkout integration
- Secure payment processing with hosted checkout
- Webhook handling for payment confirmations
- Professional booking confirmation pages
- Payment status tracking

### 🔧 Technical Features
- RESTful API design with JSON responses
- CSRF protection and security best practices
- Comprehensive input validation
- Professional error handling
- Responsive Bootstrap 5 UI

## 🚀 Technology Stack

### Backend
- **Ruby on Rails 7.2** - Web application framework
- **PostgreSQL** - Production database
- **SQLite** - Development database
- **BCrypt** - Password hashing
- **Jbuilder** - JSON API responses
- **Kaminari** - Pagination

### Frontend
- **React 17** - UI component library
- **Webpacker 5** - Asset compilation
- **Bootstrap 5** - CSS framework
- **React-dates** - Date picker component
- **Moment.js** - Date manipulation

### Payment & APIs
- **Stripe** - Payment processing
- **Stripe Checkout** - Hosted payment pages
- **Webhooks** - Payment confirmation handling

## 📋 Prerequisites

- Ruby 3.0+ 
- Rails 7.0+
- Node.js 16+
- Yarn package manager
- PostgreSQL (for production)
- Stripe account

## ⚡ Quick Start

### 1. Clone and Setup

\`\`\`bash
git clone https://github.com/your-username/airbnb-clone.git
cd airbnb-clone

# Install dependencies
bundle install
yarn install
\`\`\`

### 2. Environment Configuration

\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env with your Stripe API keys
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
\`\`\`

### 3. Database Setup

\`\`\`bash
# Create and migrate database
rails db:create
rails db:migrate
rails db:seed
\`\`\`

### 4. Start Development Server

\`\`\`bash
# Option 1: Use foreman (recommended)
foreman start -f Procfile.dev

# Option 2: Start services separately
rails server                    # Terminal 1
./bin/webpack-dev-server        # Terminal 2
\`\`\`

### 5. Visit Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage Guide

### For Users
1. **Browse Properties**: View available properties on the home page
2. **Property Details**: Click any property to see full details
3. **Create Account**: Sign up for a new account or log in
4. **Make Booking**: Select dates, guests, and proceed to payment
5. **Complete Payment**: Use Stripe's secure checkout process
6. **View Confirmation**: See booking details on the success page

### For Developers
- **API Endpoints**: Visit `/api/properties`, `/api/bookings`, etc.
- **Admin Panel**: Use Rails console for data management
- **Webhook Testing**: Use Stripe CLI for local webhook testing

## 🔧 Development

### Key Commands

\`\`\`bash
# Database operations
rails db:migrate                # Run migrations
rails db:seed                   # Seed sample data
rails db:reset                  # Reset database

# Asset compilation
NODE_OPTIONS="--openssl-legacy-provider" ./bin/webpack

# Testing
rails console                   # Rails console
rails routes                    # View all routes
\`\`\`

### Stripe Webhook Testing

\`\`\`bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --events checkout.session.completed \\
  --forward-to localhost:3000/api/charges/mark_complete
\`\`\`

## 📁 Project Structure

\`\`\`
airbnb-clone/
├── app/
│   ├── controllers/api/        # API controllers
│   ├── models/                 # Data models
│   ├── views/api/             # JSON response templates
│   └── javascript/
│       ├── src/               # React components
│       └── packs/             # Webpack entry points
├── config/
│   ├── routes.rb              # Application routes
│   └── initializers/          # Configuration files
├── db/
│   ├── migrate/               # Database migrations
│   └── seeds.rb               # Sample data
├── .env.example               # Environment template
├── CLAUDE.md                  # Development guide
└── DEPLOYMENT.md              # Deployment instructions
\`\`\`

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Heroku
- Render
- Other cloud platforms

## 🔒 Security

- Environment variables for sensitive data
- CSRF protection on all forms
- Input validation and sanitization
- Secure session management
- Stripe webhook signature verification

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List properties with pagination |
| GET | `/api/properties/:id` | Get property details |
| POST | `/api/users` | Create user account |
| POST | `/api/sessions` | User login |
| DELETE | `/api/sessions` | User logout |
| GET | `/api/authenticated` | Check authentication status |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking details |
| POST | `/api/charges` | Create Stripe checkout session |
| POST | `/api/charges/mark_complete` | Stripe webhook endpoint |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature-name\`
3. Commit changes: \`git commit -am 'Add feature'\`
4. Push to branch: \`git push origin feature-name\`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built as part of [Altcademy](https://www.altcademy.com/) curriculum
- Uses Stripe for secure payment processing
- UI inspired by Airbnb's design patterns
- Bootstrap for responsive design components

## 📞 Support

For support and questions:
- Check [CLAUDE.md](CLAUDE.md) for development guidance
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Open an issue for bug reports
- Contact the development team for urgent issues

---

**🎉 Happy coding!** This project demonstrates a complete full-stack web application with modern technologies and production-ready features.