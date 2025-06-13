import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../layout';
import BookingWidget from './bookingWidget';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property: null,
      loading: false,
      error: null,
      user: null,
      isAuthenticated: false,
      authLoading: true,
    };
  }

  componentDidMount() {
    this.checkAuthentication();
    const propertyId = this.props.propertyId;
    if (propertyId) {
      this.loadProperty(propertyId);
    }
  }

  checkAuthentication = () => {
    fetch('/api/authenticated', safeCredentials({
      method: 'GET',
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isAuthenticated: data.authenticated,
          user: data.user || null,
          authLoading: false,
        });
      })
      .catch(error => {
        console.error('Error checking authentication:', error);
        this.setState({ 
          isAuthenticated: false,
          user: null,
          authLoading: false,
        });
      });
  };

  loadProperty = (propertyId) => {
    this.setState({ loading: true, error: null });

    fetch(`/api/properties/${propertyId}`, safeCredentials({
      method: 'GET',
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({
          property: data.property,
          loading: false,
        });
      })
      .catch(error => {
        console.error('Error loading property:', error);
        this.setState({ 
          loading: false, 
          error: 'Failed to load property. Please try again.' 
        });
      });
  };

  formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  handleLogout = () => {
    fetch('/api/sessions', safeCredentials({
      method: 'DELETE',
    }))
      .then(handleErrors)
      .then(() => {
        this.setState({
          isAuthenticated: false,
          user: null,
        });
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  render() {
    const { property, loading, error, user } = this.state;

    if (loading) {
      return (
        <Layout user={user} onLogout={this.handleLogout}>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading property details...</p>
          </div>
        </Layout>
      );
    }

    if (error) {
      return (
        <Layout user={user} onLogout={this.handleLogout}>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <div className="text-center">
            <a href="/" className="btn btn-primary">
              Back to Home
            </a>
          </div>
        </Layout>
      );
    }

    if (!property) {
      return (
        <Layout user={user} onLogout={this.handleLogout}>
          <div className="text-center py-5">
            <h4 className="text-muted">Property not found</h4>
            <p className="text-muted">The property you're looking for doesn't exist.</p>
            <a href="/" className="btn btn-primary">
              Back to Home
            </a>
          </div>
        </Layout>
      );
    }

    return (
      <Layout user={user} onLogout={this.handleLogout}>
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {property.title}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mb-4">
            {/* Property Image */}
            <div className="card mb-4">
              <img 
                src={property.image_url} 
                className="card-img-top" 
                alt={property.title}
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </div>

            {/* Property Details */}
            <div className="card">
              <div className="card-body">
                <h1 className="card-title h2 mb-3">{property.title}</h1>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="text-muted mb-1">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {property.city}, {property.country}
                    </p>
                    <p className="text-muted mb-0">
                      <i className="fas fa-home me-2"></i>
                      {property.property_type}
                    </p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <p className="text-muted mb-1">
                      Hosted by <strong>{property.user.username}</strong>
                    </p>
                  </div>
                </div>

                <hr />

                <div className="row mb-4">
                  <div className="col-3 text-center">
                    <h5 className="mb-1">{property.max_guests}</h5>
                    <small className="text-muted">Guests</small>
                  </div>
                  <div className="col-3 text-center">
                    <h5 className="mb-1">{property.bedrooms}</h5>
                    <small className="text-muted">Bedroom{property.bedrooms !== 1 ? 's' : ''}</small>
                  </div>
                  <div className="col-3 text-center">
                    <h5 className="mb-1">{property.beds}</h5>
                    <small className="text-muted">Bed{property.beds !== 1 ? 's' : ''}</small>
                  </div>
                  <div className="col-3 text-center">
                    <h5 className="mb-1">{property.baths}</h5>
                    <small className="text-muted">Bath{property.baths !== 1 ? 's' : ''}</small>
                  </div>
                </div>

                <hr />

                <h4 className="mb-3">About this place</h4>
                <p className="card-text">{property.description}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <BookingWidget property={property} />
          </div>
        </div>
      </Layout>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('property-container');
  const propertyId = container.getAttribute('data-property-id');
  
  ReactDOM.render(
    <Property propertyId={propertyId} />,
    container
  );
});