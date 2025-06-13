import React from 'react';
import Layout from '../layout';
import MyBookings from './myBookings';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class MyBookingsWithLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      authLoading: true,
    };
  }

  componentDidMount() {
    this.checkAuthentication();
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
    const { user, isAuthenticated, authLoading } = this.state;

    if (authLoading) {
      return (
        <Layout user={user} onLogout={this.handleLogout}>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Layout>
      );
    }

    if (!isAuthenticated) {
      return (
        <Layout user={user} onLogout={this.handleLogout}>
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <h2>Please Log In</h2>
              <p>You need to be logged in to view your bookings.</p>
              <a href="/login" className="btn btn-primary">Go to Login</a>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout user={user} onLogout={this.handleLogout}>
        <MyBookings />
      </Layout>
    );
  }
}

export default MyBookingsWithLayout;