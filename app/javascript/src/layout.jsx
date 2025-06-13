import React from 'react';
import PropTypes from 'prop-types';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

const Layout = ({ children, user, onLogout }) => {
  return (
    <React.Fragment>
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
                  <li className="nav-item dropdown">
                    <a 
                      className="nav-link dropdown-toggle" 
                      href="#" 
                      id="navbarDropdown" 
                      role="button" 
                      data-bs-toggle="dropdown"
                    >
                      {user.username}
                    </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="/my-bookings">My Bookings</a></li>
                      <li><a className="dropdown-item" href="/host-bookings">Host Bookings</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" href="/add-property">Add Property</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item btn btn-link"
                          onClick={onLogout}
                          style={{border: 'none', background: 'none', width: '100%', textAlign: 'left'}}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
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