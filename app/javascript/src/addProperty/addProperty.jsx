import React, { Component } from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

class AddProperty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      property: {
        title: '',
        description: '',
        city: '',
        country: '',
        property_type: '',
        price_per_night: '',
        max_guests: 1,
        bedrooms: 0,
        beds: 0,
        baths: 0,
        amenities: '',
        policies: '',
        neighborhood: ''
      },
      images: [],
      imagePreviews: [],
      loading: false,
      errors: [],
      success: false
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      property: {
        ...this.state.property,
        [name]: value
      },
      errors: []
    });
  };

  handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    
    this.setState({
      images: files,
      imagePreviews: previews,
      errors: []
    });
  };

  removeImage = (index) => {
    const newImages = [...this.state.images];
    const newPreviews = [...this.state.imagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    this.setState({
      images: newImages,
      imagePreviews: newPreviews
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    
    if (this.state.images.length === 0) {
      this.setState({ errors: ['Please upload at least one image'] });
      return;
    }

    this.setState({ loading: true, errors: [] });

    const formData = new FormData();
    
    // Add property data
    Object.keys(this.state.property).forEach(key => {
      formData.append(`property[${key}]`, this.state.property[key]);
    });
    
    // Add images
    this.state.images.forEach(image => {
      formData.append('images[]', image);
    });

    fetch('/api/properties', safeCredentials({
      method: 'POST',
      body: formData
    }))
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        if (data.property) {
          this.setState({ 
            success: true, 
            loading: false 
          });
          // Redirect to the new property page after 2 seconds
          setTimeout(() => {
            window.location.href = `/property/${data.property.id}`;
          }, 2000);
        } else {
          this.setState({
            errors: data.errors || ['Failed to create property'],
            loading: false
          });
        }
      })
      .catch(error => {
        this.setState({
          errors: ['Network error. Please try again.'],
          loading: false
        });
      });
  };

  render() {
    const { property, imagePreviews, loading, errors, success } = this.state;

    if (success) {
      return (
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card text-center">
                <div className="card-body">
                  <h2 className="text-success">Property Created Successfully!</h2>
                  <p>Redirecting to your new property...</p>
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card add-property-card">
              <div className="card-body">
                <h1 className="card-title text-center mb-4">Add New Property</h1>
                
                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <ul className="mb-0">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={this.handleSubmit}>
                  {/* Basic Information */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h4>Basic Information</h4>
                      <hr />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-8">
                      <label className="form-label">Property Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={property.title}
                        onChange={this.handleInputChange}
                        required
                        maxLength="70"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Property Type</label>
                      <select
                        className="form-select"
                        name="property_type"
                        value={property.property_type}
                        onChange={this.handleInputChange}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Condo">Condo</option>
                        <option value="Villa">Villa</option>
                        <option value="Cabin">Cabin</option>
                        <option value="Studio">Studio</option>
                        <option value="Loft">Loft</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={property.description}
                      onChange={this.handleInputChange}
                      rows="4"
                      required
                      maxLength="2000"
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={property.city}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={property.country}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Neighborhood</label>
                      <input
                        type="text"
                        className="form-control"
                        name="neighborhood"
                        value={property.neighborhood}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h4>Property Details</h4>
                      <hr />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-3">
                      <label className="form-label">Price per Night ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price_per_night"
                        value={property.price_per_night}
                        onChange={this.handleInputChange}
                        min="1"
                        max="99999"
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Max Guests</label>
                      <input
                        type="number"
                        className="form-control"
                        name="max_guests"
                        value={property.max_guests}
                        onChange={this.handleInputChange}
                        min="1"
                        max="20"
                        required
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Bedrooms</label>
                      <input
                        type="number"
                        className="form-control"
                        name="bedrooms"
                        value={property.bedrooms}
                        onChange={this.handleInputChange}
                        min="0"
                        max="20"
                        required
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Beds</label>
                      <input
                        type="number"
                        className="form-control"
                        name="beds"
                        value={property.beds}
                        onChange={this.handleInputChange}
                        min="0"
                        max="20"
                        required
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Bathrooms</label>
                      <input
                        type="number"
                        className="form-control"
                        name="baths"
                        value={property.baths}
                        onChange={this.handleInputChange}
                        min="0"
                        max="20"
                        step="0.5"
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h4>Additional Information</h4>
                      <hr />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Amenities</label>
                    <textarea
                      className="form-control"
                      name="amenities"
                      value={property.amenities}
                      onChange={this.handleInputChange}
                      rows="3"
                      placeholder="List amenities separated by commas (e.g., WiFi, Kitchen, Parking, Pool, etc.)"
                      maxLength="2000"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">House Rules & Policies</label>
                    <textarea
                      className="form-control"
                      name="policies"
                      value={property.policies}
                      onChange={this.handleInputChange}
                      rows="3"
                      placeholder="House rules, check-in/out times, cancellation policy, etc."
                      maxLength="2000"
                    />
                  </div>

                  {/* Images */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h4>Property Images</h4>
                      <hr />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Images</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      onChange={this.handleImageChange}
                      required
                    />
                    <div className="form-text">Upload multiple high-quality images of your property</div>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label">Image Previews</label>
                      <div className="row">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-md-3 mb-3">
                            <div className="image-preview-container">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="img-fluid rounded"
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm remove-image-btn"
                                onClick={() => this.removeImage(index)}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <a href="/" className="btn btn-outline-primary me-md-2">Cancel</a>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Property...
                        </>
                      ) : (
                        'Create Property'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddProperty;