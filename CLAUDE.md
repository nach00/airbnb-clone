# CLAUDE.md - Airbnb Clone Project

## 1. Project Overview

This project is a full-stack Airbnb clone.

- **Backend:** Ruby on Rails (API)
- **Frontend:** React (managed by Webpacker)
- **Database:** PostgreSQL (production), SQLite (development)
- **Payments:** Stripe (Checkout & Webhooks)
- **Key Features:** User authentication, property browsing, property booking, and payments.

## 2. Developer Environment Setup

- **Ruby:** v3.0.3
- **Rails:** v6.1.5
- **Node.js:** v16.17
- **Yarn:** (Ensure it's installed)
- **Stripe CLI:** Required for local webhook testing. (Install from `https://stripe.com/docs/stripe-cli`)
- **Foreman:** For running dev servers.

**Initial Setup Steps:**

1.  `bundle install`
2.  `yarn install`
3.  `rails db:create && rails db:migrate`
4.  `rails db:seed` (to populate with initial data)

## 3. Common Bash Commands

**Running the Application (Development):**

- `foreman start -f Procfile.dev` (Recommended: starts Rails server and Webpack dev server)
- OR:
  - `rails s` (Starts Rails server, typically on port 3000)
  - `./bin/webpack-dev-server` (Starts Webpack dev server, typically on port 3035)

**Database:**

- `rails db:migrate` (Run migrations)
- `rails db:rollback` (Rollback last migration)
- `rails db:seed` (Seed the database from `db/seeds.rb`)
- `rails c` (Open Rails console)

**Stripe (Local Testing):**

- `stripe login` (If not already logged in)
- `stripe listen --events checkout.session.completed --forward-to localhost:3000/api/charges/mark_complete` (For testing webhooks)

**Dependency Management:**

- `bundle install` (Install/update Ruby gems)
- `yarn install` (Install/update JavaScript packages)

## 4. Core Files & Structure

**Backend (Ruby on Rails - `app/` directory primarily):**

- **API Controllers:** `app/controllers/api/` (e.g., `users_controller.rb`, `properties_controller.rb`, `bookings_controller.rb`, `charges_controller.rb`)
- **Models:** `app/models/` (e.g., `user.rb`, `property.rb`, `booking.rb`, `charge.rb`)
- **API Views (Jbuilder):** `app/views/api/` (e.g., `properties/index.jbuilder`, `bookings/create.jbuilder`)
- **Routes:** `config/routes.rb` (API routes are namespaced under `/api`)
- **Initializers:** `config/initializers/stripe.rb` (Stripe API key setup)
- **Database Seeds:** `db/seeds.rb`
- **Environment Variables (Local):** `.env` (stores Stripe keys, base URL. **IMPORTANT: This file is in `.gitignore`**)

**Frontend (React - `app/javascript/` directory primarily):**

- **Webpack Packs (Entry Points):** `app/javascript/packs/` (e.g., `home.js`, `property.js`, `login.js`, `application.js`)
- **React Components Source:** `app/javascript/src/`
  - **Layout:** `app/javascript/src/layout.jsx`
  - **Utilities:** `app/javascript/src/utils/fetchHelper.js` (for API calls)
  - **Page/Feature Folders:**
    - `app/javascript/src/login/` (contains `login.jsx`, `loginWidget.jsx`, `signupWidget.jsx`)
    - `app/javascript/src/property/` (contains `property.jsx`, `bookingWidget.jsx`)
  - **Home Component:** `app/javascript/src/home.jsx`
- **SCSS Styles:** Associated with components (e.g., `app/javascript/src/home.scss`, `app/javascript/src/property/property.scss`)
- **Webpack Configuration:** `config/webpack/environment.js` (exposes `STRIPE_PUBLISHABLE_KEY` and `URL` to frontend)
- **Rails Views (hosting React apps):** `app/views/static_pages/` (e.g., `home.html.erb`, `property.html.erb`)

**Important Configuration Files:**

- `Procfile` (for Heroku production)
- `Procfile.dev` (for local development with Foreman)

## 5. API Structure

- All API endpoints are prefixed with `/api`.
- Responses are typically JSON, formatted using Jbuilder templates.
- Authentication is token-based using a signed cookie (`airbnb_session_token`).
- `Api::SessionsController#authenticated` (`GET /api/authenticated`) is used to check login status.

## 6. Frontend Conventions

- **React Components:**
  - Per project guidelines ("Finish the clone" document), **prefer class components if state or effects are complex (more than 1 state/effect or >30 lines).** Use functional components with hooks for simpler cases, and pure functional components for display-only.
  - JSX is used for templating.
- **Styling:** SCSS. Bootstrap 5 is available and imported in `application.scss`.
- **API Interaction:** Use `fetchHelper.js` (`safeCredentials`, `handleErrors`) for API calls.
- **State Management:** Primarily component-level state.
- **Routing:** Rails handles the primary page routes (`/`, `/property/:id`, `/login`). React components are mounted on these pages.

## 7. Backend Conventions

- Follow standard Rails MVC patterns.
- **Models:** Include validations and associations as defined in the SDD.
- **Controllers:** Ensure appropriate HTTP status codes are returned (e.g., `:created`, `:ok`, `:bad_request`, `:unauthorized`, `:not_found`).
- **Pagination:** Kaminari gem is used for paginating properties (`.page(params[:page]).per(6)`).
- **Security:**
  - `BCrypt` for password hashing.
  - `skip_before_action :verify_authenticity_token` is used for the Stripe webhook endpoint as it's an external POST request.

## 8. Key Workflows & Logic

- **User Authentication:** Sign up, log in, session management via cookies.
- **Property Booking:**
  1. User selects dates on `BookingWidget.jsx`.
  2. POST to `/api/bookings`. Backend validates (date conflicts, user logged in).
  3. On success, `BookingWidget.jsx` POSTs to `/api/charges`.
  4. Backend creates Stripe Checkout session, returns `checkout_session_id`.
  5. Frontend uses `stripe.redirectToCheckout()`.
- **Stripe Payment & Webhooks:**
  1. User pays on Stripe.
  2. Stripe sends `checkout.session.completed` event to `/api/charges/mark_complete`.
  3. Backend verifies webhook, updates `Charge.complete` to `true`.
  4. Stripe redirects user to a success URL (e.g., `/booking/:id/success`). **This page needs to be created.**

## 9. Stripe Integration Details

- **Environment Variables for Stripe:**
  - `STRIPE_PUBLISHABLE_KEY` (frontend, via Webpack)
  - `STRIPE_SECRET_KEY` (backend, via `config/initializers/stripe.rb`)
  - `STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET` (backend, for webhook verification)
  - `URL` (used for constructing `success_url` and `cancel_url`)
- **Stripe.js:** Included via a `<script>` tag in `app/views/static_pages/property.html.erb`.
- **Webhook Endpoint:** `POST /api/charges/mark_complete`. Requires Stripe CLI for local testing.

## 10. Testing Instructions

- (Initial project stage) Manual testing of user flows.
- **Considerations for future tests:**
  - Rails: RSpec or Minitest for models, controllers, API endpoints.
  - React: Jest, React Testing Library for components.
  - TDD approach can be effective for new features.
- When writing tests, ensure they cover core logic (e.g., booking validation, payment states).

## 11. Code Style Guidelines

- Follow existing code patterns within the project.
- **Ruby:** Adhere to general Ruby and Rails conventions.
- **JavaScript/React:**
  - ES Modules (`import/export`).
  - Prioritize class components for complex state/effects as noted in "Frontend Conventions".
- **SCSS:** Maintain readability and organization.
- Keep Jbuilder views concise, only exposing necessary data.

## 12. Repository Etiquette

- (To be defined by team)
- Example: Use feature branches (e.g., `feature/add-property-search`).
- Example: Write clear commit messages.
- Example: Rebase before merging to `main`/`develop`.

## 13. Tips for Working with Claude on This Project

- Refer to the System Design Document (SDD.md) for detailed architecture and data models.
- When asking for code generation, specify if it's for the Rails backend (controller, model, Jbuilder view) or React frontend (component, SCSS).
- Mention specific file paths if you know them.
- For UI changes, providing visual mockups or descriptions of desired appearance is helpful.
- If a task involves multiple steps (e.g., backend API + frontend consumption), break it down or ask Claude for a plan first.
- For Stripe-related tasks, be clear about whether it's frontend (Stripe.js) or backend (Stripe Ruby gem, webhooks) interaction.
