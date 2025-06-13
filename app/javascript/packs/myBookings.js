import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import MyBookings from '@src/myBookings/myBookings';
import '@src/myBookings/myBookings.scss';

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
    fetch('/api/authenticated')
      .then(response => response.json())
      .then(data => {
        this.setState({
          user: data.user,
          isAuthenticated: data.authenticated,
          authLoading: false,
        });
      })
      .catch(() => {
        this.setState({ authLoading: false });
      });
  };

  handleLogout = () => {
    fetch('/api/sessions', { method: 'DELETE' })
      .then(() => {
        window.location.href = '/';
      });
  };

  render() {
    const { user, authLoading } = this.state;
    
    if (authLoading) {
      return <div>Loading...</div>;
    }

    return (
      <Layout user={user} onLogout={this.handleLogout}>
        <MyBookings />
      </Layout>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('my-bookings');
  if (container) {
    ReactDOM.render(<MyBookingsWithLayout />, container);
  }
});