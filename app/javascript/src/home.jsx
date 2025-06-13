import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: [],
      totalPages: 0,
      nextPage: null,
      currentPage: 1,
      loading: false,
      error: null,
      user: null,
      isAuthenticated: false,
      authLoading: true,
    };
  }

  componentDidMount() {
    this.checkAuthentication();
    this.loadProperties();
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

  loadProperties = (page = 1) => {
    this.setState({ loading: true, error: null });

    fetch(`/api/properties?page=${page}`, safeCredentials({
      method: 'GET',
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState(prevState => ({
          properties: page === 1 ? data.properties : [...prevState.properties, ...data.properties],
          totalPages: data.total_pages,
          nextPage: data.next_page,
          currentPage: data.current_page,
          loading: false,
        }));
      })
      .catch(error => {
        console.error('Error loading properties:', error);
        this.setState({ 
          loading: false, 
          error: 'Failed to load properties. Please try again.' 
        });
      });
  };

  loadMore = () => {
    if (this.state.nextPage && !this.state.loading) {
      this.loadProperties(this.state.nextPage);
    }
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
    const { properties, loading, error, nextPage, user } = this.state;

    return (
      <Layout user={user} onLogout={this.handleLogout}>
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Find Your Perfect Stay</h1>
            <p className="text-muted mb-4">
              Discover amazing places to stay around the world
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row">
          {properties.map(property => (
            <div key={property.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <img 
                  src={property.image_url} 
                  className="card-img-top" 
                  alt={property.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{property.title}</h5>
                  <p className="card-text text-muted small">
                    {property.city}, {property.country}
                  </p>
                  <p className="card-text flex-grow-1">
                    {property.description.length > 100 
                      ? `${property.description.substring(0, 100)}...`
                      : property.description
                    }
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                      <strong className="text-primary">
                        {this.formatPrice(property.price_per_night)}
                      </strong>
                      <small className="text-muted"> / night</small>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">
                        {property.max_guests} guests
                      </small>
                      <small className="text-muted">
                        {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
                      </small>
                    </div>
                  </div>
                  <a 
                    href={`/property/${property.id}`} 
                    className="btn btn-primary mt-3"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {properties.length === 0 && !loading && !error && (
          <div className="text-center py-5">
            <h4 className="text-muted">No properties found</h4>
            <p className="text-muted">Check back later for new listings!</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading properties...</p>
          </div>
        )}

        {nextPage && !loading && (
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-primary btn-lg"
              onClick={this.loadMore}
            >
              Load More Properties
            </button>
          </div>
        )}
      </Layout>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Home />,
    document.body.appendChild(document.createElement('div')),
  );
});
