import React, { Component } from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

class MyBookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      loading: true,
      error: ''
    };
  }

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    fetch('/api/my-bookings', safeCredentials())
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({
          bookings: data.bookings || [],
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          error: 'Failed to load bookings',
          loading: false
        });
      });
  };

  startPayment = (bookingId) => {
    // Create charge for unpaid booking
    fetch('/api/charges', safeCredentials({
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId })
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          if (data.demo_mode) {
            alert(`Booking payment created successfully! \n\nIn production, this would redirect to Stripe payment.\nBooking ID: ${data.charge.booking_id}\n\nTo enable payments, set real Stripe API keys in Heroku config.`);
            this.fetchBookings(); // Refresh bookings
          } else {
            const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY;
            if (typeof window.Stripe !== 'undefined' && stripeKey && !stripeKey.includes('placeholder')) {
              const stripe = window.Stripe(stripeKey);
              stripe.redirectToCheckout({
                sessionId: data.checkout_session_id
              });
            } else {
              alert('Stripe is not properly configured');
            }
          }
        } else {
          alert(data.error || 'Payment setup failed');
        }
      })
      .catch(() => {
        alert('Payment setup failed. Please try again.');
      });
  };

  formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  render() {
    const { bookings, loading, error } = this.state;

    if (loading) {
      return (
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading your bookings...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container my-5">
          <div className="alert alert-danger">
            {error}
          </div>
        </div>
      );
    }

    return (
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">My Bookings</h1>
            
            {bookings.length === 0 ? (
              <div className="card text-center">
                <div className="card-body py-5">
                  <h3>No bookings yet</h3>
                  <p className="text-muted">When you book a stay, your reservations will appear here.</p>
                  <a href="/" className="btn btn-primary">Start exploring</a>
                </div>
              </div>
            ) : (
              <div className="row">
                {bookings.map(booking => (
                  <div key={booking.id} className="col-lg-6 mb-4">
                    <div className="card booking-card">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img
                            src={booking.property.image_url || '/placeholder-image.jpg'}
                            className="img-fluid rounded-start property-image"
                            alt={booking.property.title}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{booking.property.title}</h5>
                            <p className="card-text">
                              <small className="text-muted">
                                {booking.property.city}, {booking.property.country}
                              </small>
                            </p>
                            
                            <div className="booking-details">
                              <div className="detail-row">
                                <strong>Dates:</strong> {this.formatDate(booking.start_date)} - {this.formatDate(booking.end_date)}
                              </div>
                              <div className="detail-row">
                                <strong>Guests:</strong> {booking.guests}
                              </div>
                              <div className="detail-row">
                                <strong>Nights:</strong> {booking.nights}
                              </div>
                              <div className="detail-row">
                                <strong>Total:</strong> ${booking.total_amount}
                              </div>
                              <div className="detail-row">
                                <strong>Status:</strong> 
                                <span className={`ms-2 badge ${booking.is_paid ? 'bg-success' : 'bg-warning'}`}>
                                  {booking.is_paid ? 'Paid' : 'Unpaid'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              {!booking.is_paid && (
                                <button
                                  className="btn btn-primary me-2"
                                  onClick={() => this.startPayment(booking.id)}
                                >
                                  Pay Now
                                </button>
                              )}
                              <a
                                href={`/property/${booking.property.id}`}
                                className="btn btn-outline-primary"
                              >
                                View Property
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MyBookings;