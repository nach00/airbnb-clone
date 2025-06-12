# System Design Document: Full-Stack Airbnb Clone

## 1. Project Overview

This document outlines the system design for a full-stack Airbnb clone. The application allows users to browse properties, register/login, book properties for specific dates, and make payments. The backend is built with Ruby on Rails, serving a RESTful API. The frontend is built with React, managed via Webpacker. Payments are handled by Stripe.

**User Stories:**

1.  As a user, I want to browse a list of available properties.
2.  As a user, I want to view detailed information about a single property.
3.  As a user, I want to sign up for an account and log in.
4.  As a logged-in user, I want to book a property by selecting check-in and check-out dates.
5.  As a logged-in user, I want to pay for my booking.

## 2. Technical Stack

- **Backend:** Ruby on Rails (v6.1.5, Ruby v3.0.3)
- **Frontend:** React (via Webpacker)
- **JavaScript Bundler:** Webpacker
- **Styling:** Bootstrap 5 (via NPM), SCSS
- **Database:** PostgreSQL (implied by Rails default for production, SQLite for dev)
- **Payment Gateway:** Stripe (Stripe Checkout, Webhooks)
- **Pagination:** Kaminari gem
- **Development Server Management:** Foreman (`Procfile.dev`)
- **Deployment:** Heroku

## 3. System Architecture

The system follows a client-server architecture:

- **Rails Backend:**
  - Provides RESTful API endpoints under the `/api` namespace.
  - Handles business logic, database interactions, user authentication, and payment processing logic (interacting with Stripe API).
  - Serves initial HTML views that load the React application.
- **React Frontend:**
  - Single Page Application (SPA) characteristics for different views (Home, Property, Login).
  - Consumes the Rails API to fetch and display data.
  - Handles user interactions and client-side state management.
  - Integrates with Stripe.js for payment checkout.
- **Stripe:**
  - External service for processing payments.
  - Provides Stripe Checkout for a pre-built payment UI.
  - Uses Webhooks to notify the backend about payment status changes.

## 4. Data Models (Database Schema)

### 4.1. Users

    - `id` (Primary Key)
    - `username` (string)
    - `email` (string, unique)
    - `password_digest` (string, for BCrypt)
    - `created_at`, `updated_at` (timestamps)
    - **Associations:**
        - `has_many :sessions`
        - `has_many :properties`
        - `has_many :bookings`

### 4.2. Sessions (for user authentication)

    - `id` (Primary Key)
    - `token` (string, unique)
    - `user_id` (Foreign Key to Users)
    - `created_at`, `updated_at` (timestamps)
    - **Associations:**
        - `belongs_to :user`

### 4.3. Properties

    - `id` (Primary Key)
    - `title` (string, max: 70)
    - `description` (string, max: 2000)
    - `city` (string, max: 200)
    - `country` (string, max: 200)
    - `property_type` (string, max: 200)
    - `price_per_night` (integer, 0-99999 USD)
    - `max_guests` (integer, 0-20)
    - `bedrooms` (integer, 0-20)
    - `beds` (integer, 0-20)
    - `baths` (integer, 0-20)
    - `image_url` (string) - *Initial implementation, later to be replaced/augmented by ActiveStorage*
    - `user_id` (Foreign Key to Users)
    - `created_at`, `updated_at` (timestamps)
    - **Associations:**
        - `belongs_to :user`
        - `has_many :bookings`
        - `has_many_attached :images` (for ActiveStorage, part of "Finish the Clone")

### 4.4. Bookings

    - `id` (Primary Key)
    - `start_date` (date)
    - `end_date` (date)
    - `user_id` (Foreign Key to Users)
    - `property_id` (Foreign Key to Properties)
    - `created_at`, `updated_at` (timestamps)
    - **Associations:**
        - `belongs_to :user`
        - `belongs_to :property`
        - `has_many :charges`
    - **Validations:**
        - `start_date` must be before `end_date`.
        - Date range must not overlap with existing bookings for the same property.

### 4.5. Charges (for Stripe payments)

    - `id` (Primary Key)
    - `checkout_session_id` (string, Stripe's session ID)
    - `currency` (string, e.g., "usd")
    - `amount` (decimal, precision: 10, scale: 2)
    - `complete` (boolean, default: false)
    - `booking_id` (Foreign Key to Bookings)
    - `created_at`, `updated_at` (timestamps)
    - **Associations:**
        - `belongs_to :booking`

## 5. API Endpoints (Rails Backend - `/api` namespace)

### 5.1. Users

- `POST /api/users` - Create a new user.
  - Controller: `Api::UsersController#create`
  - View: `api/users/create.jbuilder`

### 5.2. Sessions (Authentication)

- `POST /api/sessions` - Log in a user (create a session).
  - Controller: `Api::SessionsController#create`
  - View: `api/sessions/create.jbuilder`
- `DELETE /api/sessions` - Log out a user (destroy a session). _Note: The provided docs show this is implemented but not explicitly how `destroy` is called from frontend._
  - Controller: `Api::SessionsController#destroy`
- `GET /api/authenticated` - Check if the current user is authenticated.
  - Controller: `Api::SessionsController#authenticated`
  - View: `api/sessions/authenticated.jbuilder`

### 5.3. Properties

- `GET /api/properties` - List all properties (paginated).
  - Controller: `Api::PropertiesController#index`
  - View: `api/properties/index.jbuilder`
- `GET /api/properties/:id` - Show details for a specific property.
  - Controller: `Api::PropertiesController#show`
  - View: `api/properties/show.jbuilder`

### 5.4. Bookings

- `POST /api/bookings` - Create a new booking.
  - Controller: `Api::BookingsController#create`
  - View: `api/bookings/create.jbuilder`
- `GET /api/properties/:id/bookings` - Get all bookings for a specific property (ending after today).
  - Controller: `Api::BookingsController#get_property_bookings`
  - View: `api/bookings/index.jbuilder`

### 5.5. Charges (Payments)

- `POST /api/charges` - Create a Stripe Checkout session and a charge record.
  - Controller: `Api::ChargesController#create`
  - View: `api/charges/create.jbuilder`
- `POST /api/charges/mark_complete` - Stripe Webhook endpoint to mark a charge as complete.
  - Controller: `Api::ChargesController#mark_complete`
  - No view, returns `head :ok` or `head :bad_request`.

## 6. Frontend Components (React)

### 6.1. Core/Layout

- `Layout.jsx`: Wraps pages with common elements like Navbar and Footer.
  - File: `app/javascript/src/layout.jsx`
- `fetchHelper.js`: Utility functions for API calls (`handleErrors`, `safeCredentials`).
  - File: `app/javascript/src/utils/fetchHelper.js`

### 6.2. Pages & Widgets

- **Home Page:**

  - Entry: `app/javascript/packs/home.js`
  - Main Component: `Home.jsx`
    - Displays a list of properties fetched from `/api/properties`.
    - Implements "Load more" functionality for pagination.
    - File: `app/javascript/src/home.jsx`
  - Styling: `app/javascript/src/home.scss`
  - Rails View: `app/views/static_pages/home.html.erb`

- **Property Page:**

  - Entry: `app/javascript/packs/property.js`
  - Main Component: `Property.jsx`
    - Displays detailed information for a single property fetched from `/api/properties/:id`.
    - Receives `property_id` from Rails view via a `data-params` attribute.
    - Renders `BookingWidget.jsx`.
    - File: `app/javascript/src/property/property.jsx` (moved from `src/`)
  - Entry point for property folder: `app/javascript/src/property/index.jsx`
  - Rails View: `app/views/static_pages/property.html.erb` (includes Stripe.js script tag)
  - Styling: `app/javascript/src/property/property.scss`
  - **Booking Widget:** `BookingWidget.jsx`
    - Handles date selection (using `react-dates`).
    - Checks if user is authenticated; if not, links to login with `redirect_url`.
    - Submits booking to `/api/bookings`.
    - On successful booking, initiates Stripe payment via `initiateStripeCheckout`.
    - Blocks already booked dates on the calendar.
    - File: `app/javascript/src/property/bookingWidget.jsx`

- **Login/Sign Up Page:**
  - Entry: `app/javascript/packs/login.js`
  - Main Component: `Login.jsx`
    - Manages display of `LoginWidget` or `SignupWidget`.
    - Checks authentication status.
    - File: `app/javascript/src/login/login.jsx`
  - Entry point for login folder: `app/javascript/src/login/index.jsx`
  - Rails View: `app/views/static_pages/login.html.erb`
  - Styling: `app/javascript/src/login/login.scss` (can be empty)
  - **Login Widget:** `LoginWidget.jsx`
    - Form for email/password.
    - Submits to `/api/sessions`.
    - Redirects on success (handles `redirect_url` query param).
    - File: `app/javascript/src/login/loginWidget.jsx`
  - **Sign Up Widget:** `SignupWidget.jsx`
    - Form for username/email/password.
    - Submits to `/api/users`.
    - On successful signup, calls its own login method (POST to `/api/sessions`).
    - Redirects on success.
    - File: `app/javascript/src/login/signupWidget.jsx`

## 7. Key Processes & Workflows

### 7.1. User Registration & Login

1.  User navigates to Login/Sign Up page.
2.  Chooses Sign Up: Enters details, `SignupWidget` POSTs to `/api/users`. On success, POSTs to `/api/sessions`.
3.  Chooses Log In: Enters credentials, `LoginWidget` POSTs to `/api/sessions`.
4.  Backend validates, creates `User`/`Session`, sets a signed cookie (`airbnb_session_token`).
5.  Frontend redirects to home or `redirect_url`.

### 7.2. Property Booking & Payment

1.  User views a property on `Property.jsx`.
2.  `BookingWidget.jsx` checks authentication. If not logged in, directs to login with `redirect_url`.
3.  User selects dates and clicks "Book".
4.  `BookingWidget.jsx` POSTs to `/api/bookings` with `property_id`, `start_date`, `end_date`.
5.  Backend `BookingsController#create` validates dates, checks availability, creates `Booking` record.
6.  On successful booking response, `BookingWidget.jsx` calls `initiateStripeCheckout`.
7.  `initiateStripeCheckout` POSTs to `/api/charges` with `booking_id` and `cancel_url`.
8.  Backend `ChargesController#create` calculates amount, creates Stripe Checkout Session via Stripe API, saves `Charge` record with `checkout_session_id`. Returns `checkout_session_id`.
9.  Frontend receives `checkout_session_id`, initializes `Stripe(PUBLISHABLE_KEY)` and calls `stripe.redirectToCheckout({ sessionId })`.
10. User is redirected to Stripe's hosted checkout page.
11. User completes payment on Stripe.
12. Stripe sends a `checkout.session.completed` webhook event to `/api/charges/mark_complete`.
13. Backend `ChargesController#mark_complete` verifies webhook, finds `Charge` by `checkout_session_id`, and updates `complete` to `true`.
14. Stripe redirects user to `success_url` (e.g., `/booking/:id/success`). _This page needs to be created._

## 8. Environment Variables & Configuration

- `.env` file (local development, add to `.gitignore`):
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `URL` (e.g., `http://localhost:3000`)
  - `STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET` (from Stripe CLI)
- Rails Initializer: `config/initializers/stripe.rb` (sets `Stripe.api_key`).
- Webpack: `config/webpack/environment.js` (exposes `STRIPE_PUBLISHABLE_KEY` and `URL` to frontend).
- Heroku Config Vars (production):
  - Same keys as `.env`, but with production values from Stripe dashboard.
  - `STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET` will be a different value for the Heroku webhook endpoint.

## 9. Deployment (Heroku)

1.  Standard Rails Heroku deployment.
2.  Ensure `Procfile` exists (e.g., `web: bundle exec puma -C config/puma.rb`).
3.  Add Heroku buildpacks for Ruby and Node.js.
4.  Set up database on Heroku (`heroku run rails db:migrate`, `heroku run rails db:seed`).
5.  Configure all necessary environment variables in Heroku dashboard.
6.  Set up a production Stripe Webhook endpoint pointing to `YOUR_HEROKU_APP_URL/api/charges/mark_complete` and update the `STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET` on Heroku.

## 10. Tasks & Implementation Steps (Summary of Document Content)

1.  **Project Setup (Starter Kit):**

    - Clone starter kit.
    - `bundle install`, `rails db:create && rails db:migrate`, `yarn install`.
    - Run servers: `foreman start -f Procfile.dev` or `rails s` and `./bin/webpack-dev-server`.

2.  **Properties API (Backend):**

    - Create `CreateProperties` migration.
    - Define `Property` model with associations and validations. Update `User` model.
    - Add `kaminari` gem for pagination.
    - Implement `Api::PropertiesController` (`index`, `show`).
    - Create Jbuilder views (`index.jbuilder`, `show.jbuilder`).
    - Define routes for properties.
    - Seed database with initial user and property data (`db/seeds.rb`, `rails db:seed`).

3.  **Frontend - Home & Property Pages:**

    - Create `Layout.jsx`.
    - Create `fetchHelper.js` and configure Webpack alias `@utils`.
    - Implement `Home.jsx` to fetch and display properties with "load more".
    - Implement `Property.jsx` to display single property details (pass `property_id` from Rails).
    - Create associated SCSS files and Rails views/pack entries.

4.  **Bookings API (Backend):**

    - Create `CreateBookings` migration.
    - Define `Booking` model with associations and advanced validations (date order, availability). Update `User` and `Property` models.
    - Implement `Api::BookingsController` (`create`, `get_property_bookings`). Handle `ArgumentError` from model.
    - Create Jbuilder views (`create.jbuilder`, `index.jbuilder`).
    - Define routes for bookings.
    - Update `SessionsController` and `UsersController` to return proper HTTP status codes on errors.

5.  **Frontend - Login/Sign Up Page:**

    - Create `Login.jsx`, `LoginWidget.jsx`, `SignupWidget.jsx` in a `src/login` subdirectory.
    - Implement logic for user authentication and account creation, including redirection.
    - Create associated SCSS file and Rails view/pack entry.

6.  **Frontend - Booking Widget on Property Page:**

    - Move `Property.jsx` and `property.scss` to `src/property/`.
    - Implement `BookingWidget.jsx` within `src/property/`.
      - Integrate `react-dates` for date picking.
      - Handle booking submission and API calls.
      - Implement `isDayBlocked` logic by fetching existing bookings.

7.  **Stripe Integration - Payment API (Backend):**

    - Add `stripe` gem.
    - Configure Stripe API keys via `.env` and an initializer.
    - Create `CreateCharges` migration.
    - Define `Charge` model. Update `Booking` model.
    - Implement `Api::ChargesController#create` to create Stripe Checkout Sessions.
    - Create Jbuilder view (`api/charges/create.jbuilder`).
    - Define route for charge creation.

8.  **Stripe Integration - Payment Frontend:**

    - Add Stripe.js script tag to `property.html.erb`.
    - Expose `STRIPE_PUBLISHABLE_KEY` to frontend via Webpack.
    - Update `BookingWidget.jsx`'s `submitBooking` to call a new `initiateStripeCheckout` method.
    - `initiateStripeCheckout` to make POST to `/api/charges` and then use `stripe.redirectToCheckout`.
    - Create `Procfile` for production environment variable handling on Heroku.

9.  **Stripe Integration - Webhooks (Backend):**

    - Define route for webhook (`POST /api/charges/mark_complete`).
    - Implement `Api::ChargesController#mark_complete` to handle `checkout.session.completed` event.
      - Verify webhook signature using `STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET`.
      - Update `Charge` record to `complete: true`.
    - Test locally using Stripe CLI.
    - Configure production webhook on Stripe dashboard for Heroku.

10. **Final Touches ("Finish the Clone"):**
    - **Properties:**
      - Implement "Add New Property" feature using ActiveStorage and AWS S3 for images.
      - Implement "Edit Property" feature.
      - (Optional) Add more property fields (amenities, policies).
    - **Bookings:**
      - Create guest view for their bookings (index, paid status, pay unpaid).
      - Create host view for their properties' bookings.
      - Refine `isDayBlocked` in `BookingWidget` for checkout date.
    - **Charges:**
      - Create the `/booking/:id/success` page.
    - **Deployment:** Deploy to Heroku with all configurations.

## 11. General Instructions for LLM

- Follow the file structure and naming conventions outlined in the documents.
- Pay close attention to the code snippets provided for specific implementations.
- When implementing backend controllers and models, ensure all specified validations and associations are included.
- For frontend components, manage state and props as described.
- API calls from the frontend should use the `fetchHelper.js` utilities and target the correct Rails API endpoints.
- Ensure environment variables are used for sensitive keys and configuration, and that frontend access to these is managed through Webpack.
- The "Finish the clone" section provides tasks for further development beyond the core walkthrough.
- When asked to generate code for a specific step, refer to the corresponding HTML document.
