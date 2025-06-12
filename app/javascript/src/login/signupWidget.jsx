import React from 'react';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class SignupWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      error: null,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  validateForm = () => {
    const { username, email, password, confirmPassword } = this.state;

    if (!username || !email || !password || !confirmPassword) {
      return 'Please fill in all fields';
    }

    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    return null;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: null });

    const validationError = this.validateForm();
    if (validationError) {
      this.setState({
        loading: false,
        error: validationError
      });
      return;
    }

    const { username, email, password } = this.state;

    console.log('Submitting signup form');
    // First, create the user account
    fetch('/api/users', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          username: username,
          email: email,
          password: password
        }
      })
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        console.log('Signup response data:', data);
        if (data.user) {
          // After successful signup, log the user in
          return this.loginUser(email, password);
        } else {
          throw new Error('Signup failed');
        }
      })
      .catch(error => {
        console.error('Signup error:', error);
        this.setState({
          loading: false,
          error: 'Signup failed. Email or username may already be taken.'
        });
      });
  };

  loginUser = (email, password) => {
    return fetch('/api/sessions', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          email: email,
          password: password
        }
      })
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ loading: false });
        if (data.user) {
          this.props.onSignupSuccess(data.user);
        } else {
          this.setState({ 
            error: 'Account created but login failed. Please try logging in manually.' 
          });
        }
      })
      .catch(error => {
        console.error('Auto-login error:', error);
        this.setState({
          loading: false,
          error: 'Account created successfully! Please log in manually.'
        });
      });
  };

  render() {
    const { username, email, password, confirmPassword, loading, error } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={username}
            onChange={this.handleInputChange}
            required
            disabled={loading}
            minLength="3"
            maxLength="64"
          />
          <div className="form-text">
            Choose a unique username (3-64 characters)
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="signup-email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="signup-email"
            name="email"
            value={email}
            onChange={this.handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="signup-password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="signup-password"
            name="password"
            value={password}
            onChange={this.handleInputChange}
            required
            disabled={loading}
            minLength="8"
          />
          <div className="form-text">
            Password must be at least 8 characters long
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={this.handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="d-grid mb-3">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </span>
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="mb-0">
            Already have an account?{' '}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={this.props.onToggleForm}
              disabled={loading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    );
  }
}

export default SignupWidget;