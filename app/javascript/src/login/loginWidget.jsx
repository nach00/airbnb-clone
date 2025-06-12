import React from 'react';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class LoginWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      error: null,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: null });

    const { email, password } = this.state;

    // Basic validation
    if (!email || !password) {
      this.setState({
        loading: false,
        error: 'Please fill in all fields'
      });
      return;
    }

    console.log('Submitting login form');
    fetch('/api/sessions', safeCredentials({
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
        console.log('Login response data:', data);
        this.setState({ loading: false });
        if (data.user) {
          this.props.onLoginSuccess(data.user);
        } else {
          this.setState({ error: 'Login failed. Please try again.' });
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        this.setState({
          loading: false,
          error: 'Invalid email or password. Please try again.'
        });
      });
  };

  render() {
    const { email, password, loading, error } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={this.handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
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
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="mb-0">
            Don't have an account?{' '}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={this.props.onToggleForm}
              disabled={loading}
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>Demo Credentials:</strong><br />
            Email: john@example.com<br />
            Password: password123
          </small>
        </div>
      </form>
    );
  }
}

export default LoginWidget;