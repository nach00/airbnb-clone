const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

const path = require('path')

const customConfig = {
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '..', '..', 'app/javascript/src'),
      '@utils': path.resolve(__dirname, '..', '..', 'app/javascript/src/utils'),
    }
  }
}

environment.config.merge(customConfig);

// Expose environment variables to frontend
environment.plugins.prepend('Environment',
  new webpack.EnvironmentPlugin({
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    URL: process.env.URL
  })
);

environment.splitChunks()

module.exports = environment
