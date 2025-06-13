import React from 'react';
import PropTypes from 'prop-types';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

const Layout = ({ children, user, onLogout }) => {
  return (
    <React.Fragment>
      {/* Virgil Abloh Styling */}
      <style>{`
        .navbar {
          background-color: #ffffff !important;
          border-bottom: 3px solid #000000 !important;
          padding: 1rem 0;
        }

        .navbar-brand {
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          color: #000000 !important;
          font-size: 1.5rem !important;
        }

        .navbar-brand::before {
          content: '▲';
          margin-right: 8px;
          color: #ff6600;
        }

        .navbar-brand::after {
          content: '▲';
          margin-left: 8px;
          color: #ff6600;
        }

        .nav-link {
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #000000 !important;
          position: relative;
        }

        .nav-link:hover {
          color: #ff6600 !important;
        }

        .nav-link:hover::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          right: 0;
          height: 2px;
          background: #ff6600;
        }

        .text-primary {
          color: #000000 !important;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary" href="/">
            Airbnb Clone
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              {user ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/my-bookings">My Bookings</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/host-bookings">Host Bookings</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/add-property">Add Property</a>
                  </li>
                  <li className="nav-item">
                    <span className="navbar-text me-3">
                      Welcome, {user.username}!
                    </span>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <a className="nav-link" href="/login">Login</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mt-4 mb-5">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-light border-top mt-auto py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h6 className="fw-bold">Airbnb Clone</h6>
              <p className="text-muted small mb-0">
                Your home away from home
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted small mb-0">
                © 2024 Airbnb Clone. Built with Rails & React.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

export default Layout;