# Airbnb Clone - Deployment Guide

This guide covers deploying the Airbnb Clone application to various platforms.

## Prerequisites

- Ruby 3.0+ and Rails 7.0+
- Node.js 16+ and Yarn
- PostgreSQL database (for production)
- Stripe account with API keys

## Environment Variables

Before deploying, ensure these environment variables are set:

```bash
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET=whsec_your_webhook_secret

# Base URL (your production domain)
URL=https://your-app-domain.com

# Rails production settings
RAILS_ENV=production
RACK_ENV=production
RAILS_SERVE_STATIC_FILES=true
RAILS_LOG_TO_STDOUT=true
```

## Heroku Deployment

### 1. Prepare your app for Heroku

```bash
# Install Heroku CLI if you haven't already
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Add Node.js buildpack for Webpack compilation
heroku buildpacks:add --index 1 heroku/nodejs
heroku buildpacks:add --index 2 heroku/ruby
```

### 2. Set environment variables

```bash
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_your_key
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
heroku config:set STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET=whsec_your_secret
heroku config:set URL=https://your-app-name.herokuapp.com
heroku config:set RAILS_SERVE_STATIC_FILES=true
heroku config:set RAILS_LOG_TO_STDOUT=true
```

### 3. Deploy

```bash
# Push to Heroku
git push heroku main

# Run database migrations
heroku run rails db:migrate

# Seed the database (optional)
heroku run rails db:seed
```

### 4. Configure Stripe Webhooks

1. Go to your Stripe Dashboard → Webhooks
2. Create new endpoint: `https://your-app-name.herokuapp.com/api/charges/mark_complete`
3. Select event: `checkout.session.completed`
4. Copy the signing secret and update your Heroku config:
   ```bash
   heroku config:set STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET=whsec_your_actual_secret
   ```

## Render Deployment

### 1. Connect your GitHub repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New Web Service"
3. Connect your GitHub repository

### 2. Configure the service

- **Name**: your-app-name
- **Environment**: Ruby
- **Build Command**: `bundle install && yarn install && NODE_OPTIONS="--openssl-legacy-provider" yarn build`
- **Start Command**: `bundle exec rails server -p $PORT`

### 3. Set environment variables in Render dashboard

Add all the environment variables listed above.

### 4. Deploy

Render will automatically deploy when you push to your main branch.

## Database Setup

For production deployment, ensure your database is properly configured:

```bash
# Production database setup (run once)
RAILS_ENV=production rails db:create
RAILS_ENV=production rails db:migrate
RAILS_ENV=production rails db:seed
```

## Asset Compilation

For platforms that don't automatically compile assets:

```bash
# Precompile assets for production
RAILS_ENV=production NODE_OPTIONS="--openssl-legacy-provider" rails assets:precompile
```

## Health Check

After deployment, verify these endpoints work:

- `GET /` - Home page
- `GET /api/properties` - Properties API
- `GET /property/1` - Property detail page
- `GET /login` - Login page

## Troubleshooting

### Common Issues

1. **Webpack compilation fails**: Set `NODE_OPTIONS="--openssl-legacy-provider"`
2. **Missing environment variables**: Check all required vars are set
3. **Database connection issues**: Verify PostgreSQL is configured
4. **Stripe webhooks failing**: Ensure webhook URL and secret are correct

### Logs

**Heroku:**
```bash
heroku logs --tail
```

**Render:**
Check logs in the Render dashboard.

## Security Notes

- Never commit `.env` files with real API keys
- Use strong, unique Stripe webhook signing secrets
- Enable HTTPS in production (handled automatically by most platforms)
- Regularly rotate API keys and secrets

## Performance Optimization

For production, consider:

- Enabling Redis for caching
- CDN for static assets
- Database connection pooling
- Application monitoring (New Relic, DataDog, etc.)