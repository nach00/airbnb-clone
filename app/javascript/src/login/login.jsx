import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../layout';
import LoginWidget from './loginWidget';
import SignupWidget from './signupWidget';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: true,
      isAuthenticated: false,
      loading: true,
      user: null,
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
          loading: false,
        });

        // Don't auto-redirect if already authenticated
        // Let the user see they're logged in and choose to go elsewhere
      })
      .catch(error => {
        console.error('Error checking authentication:', error);
        this.setState({ loading: false });
      });
  };

  handleRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect_url') || '/';
    window.location.href = redirectUrl;
  };

  handleLoginSuccess = (userData) => {
    this.setState({
      isAuthenticated: true,
      user: userData,
    });
    this.handleRedirect();
  };

  handleSignupSuccess = (userData) => {
    this.setState({
      isAuthenticated: true,
      user: userData,
    });
    this.handleRedirect();
  };

  toggleForm = () => {
    this.setState(prevState => ({
      showLogin: !prevState.showLogin
    }));
  };

  render() {
    const { showLogin, isAuthenticated, loading, user } = this.state;

    if (loading) {
      return (
        <Layout>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading...</p>
          </div>
        </Layout>
      );
    }

    if (isAuthenticated && user) {
      return (
        <Layout>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center py-5">
                <h2 className="mb-3">Welcome back, {user.username}!</h2>
                <p className="text-muted mb-4">You are already logged in.</p>
                <div className="d-grid gap-2">
                  <a href="/" className="btn btn-primary">
                    Browse Properties
                  </a>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={this.handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="card-title">
                    {showLogin ? 'Welcome back' : 'Join Airbnb Clone'}
                  </h2>
                  <p className="text-muted">
                    {showLogin 
                      ? 'Sign in to your account to continue' 
                      : 'Create your account to get started'
                    }
                  </p>
                </div>

                {showLogin ? (
                  <LoginWidget 
                    onLoginSuccess={this.handleLoginSuccess}
                    onToggleForm={this.toggleForm}
                  />
                ) : (
                  <SignupWidget 
                    onSignupSuccess={this.handleSignupSuccess}
                    onToggleForm={this.toggleForm}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.body.appendChild(document.createElement('div'))
  );
});