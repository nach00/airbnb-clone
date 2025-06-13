import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

class BookingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkIn: '',
      checkOut: '',
      guests: 1,
      loading: false,
      error: '',
      isAuthenticated: false,
      checkingAuth: true,
      blockedDates: []
    };
  }

  componentDidMount() {
    this.checkAuthentication();
    this.fetchBlockedDates();
  }

  checkAuthentication = () => {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isAuthenticated: data.authenticated,
          checkingAuth: false
        });
      })
      .catch(() => {
        this.setState({
          isAuthenticated: false,
          checkingAuth: false
        });
      });
  };

  fetchBlockedDates = () => {
    // This could be enhanced to fetch actual booked dates from the API
    // For now, we'll simulate some blocked dates
    fetch(`/api/properties/${this.props.property.id}/bookings`, safeCredentials())
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        if (data.bookings) {
          const blocked = [];
          data.bookings.forEach(booking => {
            const start = moment(booking.start_date);
            const end = moment(booking.end_date);
            const current = start.clone();
            
            while (current.isBefore(end, 'day')) {
              blocked.push(current.format('YYYY-MM-DD'));
              current.add(1, 'day');
            }
          });
          this.setState({ blockedDates: blocked });
        }
      })
      .catch(() => {
        // If we can't fetch blocked dates, continue with empty array
        this.setState({ blockedDates: [] });
      });
  };

  handleDateChange = (event) => {
    const { name, value } = event.target;
    const { blockedDates } = this.state;
    
    // Check if the selected date is blocked
    if (blockedDates.includes(value)) {
      this.setState({
        error: 'This date is not available. Please select a different date.'
      });
      return;
    }
    
    // If changing check-in date, validate check-out date
    if (name === 'checkIn') {
      const { checkOut } = this.state;
      if (checkOut && moment(value).isSameOrAfter(moment(checkOut))) {
        this.setState({
          [name]: value,
          checkOut: '', // Clear check-out if it's before or same as check-in
          error: ''
        });
        return;
      }
    }
    
    // If changing check-out date, validate it's after check-in
    if (name === 'checkOut') {
      const { checkIn } = this.state;
      if (checkIn && moment(value).isSameOrBefore(moment(checkIn))) {
        this.setState({
          error: 'Check-out date must be after check-in date.'
        });
        return;
      }
      
      // Check if any dates between check-in and check-out are blocked
      if (checkIn) {
        const start = moment(checkIn);
        const end = moment(value);
        const current = start.clone().add(1, 'day'); // Start from day after check-in
        
        while (current.isBefore(end, 'day')) {
          if (blockedDates.includes(current.format('YYYY-MM-DD'))) {
            this.setState({
              error: 'Some dates in your selected range are not available.'
            });
            return;
          }
          current.add(1, 'day');
        }
      }
    }
    
    this.setState({ 
      [name]: value,
      error: '' 
    });
  };

  handleGuestsChange = (event) => {
    this.setState({ 
      guests: parseInt(event.target.value),
      error: '' 
    });
  };

  calculateNights = () => {
    const { checkIn, checkOut } = this.state;
    if (checkIn && checkOut) {
      const start = moment(checkIn);
      const end = moment(checkOut);
      const diffDays = end.diff(start, 'days');
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  calculateTotal = () => {
    const nights = this.calculateNights();
    return nights * this.props.property.price_per_night;
  };

  handleBookingSubmit = (event) => {
    event.preventDefault();
    const { checkIn, checkOut, guests, isAuthenticated } = this.state;

    if (!isAuthenticated) {
      window.location.href = `/login?redirect_url=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (!checkIn || !checkOut || guests < 1) {
      this.setState({ error: 'Please select dates and number of guests' });
      return;
    }

    if (guests > this.props.property.max_guests) {
      this.setState({ error: `Maximum ${this.props.property.max_guests} guests allowed` });
      return;
    }

    // Validate that check-out is after check-in
    if (new Date(checkOut) <= new Date(checkIn)) {
      this.setState({ error: 'Check-out date must be after check-in date' });
      return;
    }

    this.setState({ loading: true, error: '' });

    // Step 1: Create booking
    const bookingData = {
      booking: {
        property_id: this.props.property.id,
        start_date: checkIn,
        end_date: checkOut,
        guests: guests
      }
    };

    fetch('/api/bookings', safeCredentials({
      method: 'POST',
      body: JSON.stringify(bookingData)
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Step 2: Create Stripe Checkout Session
          return this.createStripeCheckout(data.booking.id);
        } else {
          throw new Error(data.errors ? data.errors.join(', ') : 'Booking failed');
        }
      })
      .catch(error => {
        this.setState({
          error: error.message || 'Network error. Please try again.',
          loading: false
        });
      });
  };

  createStripeCheckout = (bookingId) => {
    const chargeData = { booking_id: bookingId };

    fetch('/api/charges', safeCredentials({
      method: 'POST',
      body: JSON.stringify(chargeData)
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Check if it's demo mode (placeholder Stripe keys)
          if (data.demo_mode) {
            // Demo mode - show success message instead of redirecting to Stripe
            alert(`Booking created successfully! 
            
In production, this would redirect to Stripe payment.
Your booking ID: ${data.charge.booking_id}

To enable payments, set real Stripe API keys in Heroku config.`);
            this.setState({
              checkIn: '',
              checkOut: '',
              guests: 1,
              loading: false
            });
          } else {
            // Production mode - initialize Stripe and redirect to checkout
            const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY;
            if (typeof window.Stripe !== 'undefined' && stripeKey && !stripeKey.includes('placeholder')) {
              const stripe = window.Stripe(stripeKey);
              stripe.redirectToCheckout({
                sessionId: data.checkout_session_id
              }).then(result => {
                if (result.error) {
                  this.setState({
                    error: result.error.message,
                    loading: false
                  });
                }
              });
            } else {
              // Fallback for missing Stripe.js
              this.setState({
                error: 'Stripe is not properly configured',
                loading: false
              });
            }
          }
        } else {
          this.setState({
            error: data.error || 'Payment setup failed',
            loading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          error: 'Payment setup failed. Please try again.',
          loading: false
        });
      });
  };

  render() {
    const { property } = this.props;
    const { 
      checkIn, 
      checkOut, 
      guests, 
      loading, 
      error, 
      isAuthenticated,
      checkingAuth 
    } = this.state;

    const nights = this.calculateNights();
    const total = this.calculateTotal();

    if (checkingAuth) {
      return (
        <div className="card booking-widget">
          <div className="card-body">
            <div className="text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card booking-widget">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="h4 mb-0">${property.price_per_night}</span>
              <span className="text-muted"> / night</span>
            </div>
            {!isAuthenticated && (
              <small className="text-primary">Login to book</small>
            )}
          </div>

          <form onSubmit={this.handleBookingSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Check-in Date</label>
              <input
                type="date"
                className="form-control"
                name="checkIn"
                value={checkIn}
                onChange={this.handleDateChange}
                disabled={loading}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Check-out Date</label>
              <input
                type="date"
                className="form-control"
                name="checkOut"
                value={checkOut}
                onChange={this.handleDateChange}
                disabled={loading}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="guests" className="form-label fw-semibold">
                Guests
              </label>
              <select
                id="guests"
                className="form-select"
                value={guests}
                onChange={this.handleGuestsChange}
                disabled={loading}
              >
                {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} guest{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            {nights > 0 && (
              <div className="booking-summary mb-3">
                <div className="d-flex justify-content-between">
                  <span>${property.price_per_night} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>${total}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-semibold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || !checkIn || !checkOut}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Booking...
                </>
              ) : (
                isAuthenticated ? 'Reserve' : 'Login to Reserve'
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted">You won't be charged yet</small>
          </div>
        </div>
      </div>
    );
  }
}

BookingWidget.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number.isRequired,
    price_per_night: PropTypes.number.isRequired,
    max_guests: PropTypes.number.isRequired
  }).isRequired
};

export default BookingWidget;