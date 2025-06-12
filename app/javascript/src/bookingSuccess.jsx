import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class BookingSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      booking: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const bookingId = this.props.bookingId;
    if (bookingId) {
      this.loadBooking(bookingId);
    }
  }

  loadBooking = (bookingId) => {
    fetch(`/api/bookings/${bookingId}`, safeCredentials({
      method: 'GET',
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.setState({
            booking: data.booking,
            loading: false,
          });
        } else {
          this.setState({
            error: 'Booking not found',
            loading: false,
          });
        }
      })
      .catch(error => {
        console.error('Error loading booking:', error);
        this.setState({ 
          loading: false, 
          error: 'Failed to load booking details.' 
        });
      });
  };

  formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  calculateNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  calculateTotal = (booking) => {
    const nights = this.calculateNights(booking.start_date, booking.end_date);
    return nights * booking.property.price_per_night;
  };

  render() {
    const { booking, loading, error } = this.state;

    if (loading) {
      return (
        <Layout>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading booking details...</p>
          </div>
        </Layout>
      );
    }

    if (error || !booking) {
      return (
        <Layout>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Booking Not Found</h4>
                <p>{error || 'The booking you\'re looking for doesn\'t exist.'}</p>
                <hr />
                <a href="/" className="btn btn-primary">
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    const nights = this.calculateNights(booking.start_date, booking.end_date);
    const total = this.calculateTotal(booking);
    const isPaymentComplete = booking.charge && booking.charge.complete;

    return (
      <Layout>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center mb-4">
              <div className="display-1 text-success mb-3">
                <i className="fas fa-check-circle"></i>
              </div>
              <h1 className="h2 mb-3">
                {isPaymentComplete ? 'Booking Confirmed!' : 'Booking Created!'}
              </h1>
              <p className="lead text-muted">
                {isPaymentComplete 
                  ? 'Your payment has been processed and your booking is confirmed.'
                  : 'Your booking has been created. Payment processing may take a few moments.'
                }
              </p>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <img 
                      src={booking.property.image_url} 
                      className="img-fluid rounded" 
                      alt={booking.property.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <h4 className="card-title">{booking.property.title}</h4>
                    <p className="text-muted mb-3">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {booking.property.city}, {booking.property.country}
                    </p>

                    <div className="row mb-3">
                      <div className="col-sm-6">
                        <strong>Check-in</strong><br />
                        <span className="text-muted">{this.formatDate(booking.start_date)}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Check-out</strong><br />
                        <span className="text-muted">{this.formatDate(booking.end_date)}</span>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-sm-6">
                        <strong>Guests</strong><br />
                        <span className="text-muted">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                      </div>
                      <div className="col-sm-6">
                        <strong>Duration</strong><br />
                        <span className="text-muted">{nights} night{nights > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Total Amount</strong><br />
                        <span className="h4 text-primary">${total}</span>
                      </div>
                      <div className="text-end">
                        <span className={`badge ${isPaymentComplete ? 'bg-success' : 'bg-warning'} fs-6`}>
                          {isPaymentComplete ? 'Payment Complete' : 'Payment Processing'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <a href="/" className="btn btn-primary me-3">
                Browse More Properties
              </a>
              <a href={`/property/${booking.property_id}`} className="btn btn-outline-primary">
                View Property
              </a>
            </div>

            {!isPaymentComplete && (
              <div className="alert alert-info mt-4" role="alert">
                <h6 className="alert-heading">Payment Processing</h6>
                <p className="mb-0">
                  Your payment is being processed. You'll receive a confirmation email once the payment is complete.
                  If you have any questions, please contact our support team.
                </p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('booking-success-container');
  const bookingId = container.getAttribute('data-booking-id');
  
  ReactDOM.render(
    <BookingSuccess bookingId={bookingId} />,
    container
  );
});