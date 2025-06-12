import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import 'react-dates/lib/css/_datepicker.css';

class BookingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null,
      guests: 1,
      loading: false,
      error: '',
      isAuthenticated: false,
      checkingAuth: true
    };
  }

  componentDidMount() {
    this.checkAuthentication();
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

  handleDatesChange = ({ startDate, endDate }) => {
    this.setState({ 
      startDate, 
      endDate,
      error: '' 
    });
  };

  handleFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  };

  handleGuestsChange = (event) => {
    this.setState({ 
      guests: parseInt(event.target.value),
      error: '' 
    });
  };

  calculateNights = () => {
    const { startDate, endDate } = this.state;
    if (startDate && endDate) {
      return endDate.diff(startDate, 'days');
    }
    return 0;
  };

  calculateTotal = () => {
    const nights = this.calculateNights();
    return nights * this.props.property.price_per_night;
  };

  handleBookingSubmit = (event) => {
    event.preventDefault();
    const { startDate, endDate, guests, isAuthenticated } = this.state;

    if (!isAuthenticated) {
      window.location.href = `/login?redirect_url=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (!startDate || !endDate || guests < 1) {
      this.setState({ error: 'Please select dates and number of guests' });
      return;
    }

    if (guests > this.props.property.max_guests) {
      this.setState({ error: `Maximum ${this.props.property.max_guests} guests allowed` });
      return;
    }

    this.setState({ loading: true, error: '' });

    // Step 1: Create booking
    const bookingData = {
      booking: {
        property_id: this.props.property.id,
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD'),
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
          // Initialize Stripe and redirect to checkout
          if (typeof window.Stripe !== 'undefined') {
            const stripe = window.Stripe(process.env.STRIPE_PUBLISHABLE_KEY);
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
            this.setState({
              error: 'Payment system not available. Please try again.',
              loading: false
            });
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
      startDate, 
      endDate, 
      focusedInput, 
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
              <label className="form-label fw-semibold">Dates</label>
              <div className="date-picker-wrapper">
                <DateRangePicker
                  startDate={startDate}
                  startDateId="start_date_input"
                  endDate={endDate}
                  endDateId="end_date_input"
                  onDatesChange={this.handleDatesChange}
                  focusedInput={focusedInput}
                  onFocusChange={this.handleFocusChange}
                  numberOfMonths={1}
                  isOutsideRange={(day) => moment().isAfter(day)}
                  displayFormat="MMM DD, YYYY"
                  hideKeyboardShortcutsPanel={true}
                  block={true}
                />
              </div>
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
              disabled={loading || !startDate || !endDate}
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