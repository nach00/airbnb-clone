class Api::PropertiesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_property, only: [:show, :update, :destroy]
  before_action :check_property_owner, only: [:update, :destroy]

  def index
    @properties = Property.includes(images_attachments: :blob).page(params[:page]).per(6).order(:id)
    render 'api/properties/index', status: :ok
  end

  def show
    if @property
      render 'api/properties/show', status: :ok
    else
      render json: { error: 'Property not found' }, status: :not_found
    end
  end

  def create
    @property = current_user.properties.build(property_params)
    
    # Save without image validation first
    if @property.save(validate: false)
      attach_images if params[:images].present?
      
      # Now validate with images attached
      if @property.valid?
        render 'api/properties/show', status: :created
      else
        @property.destroy
        render json: { 
          success: false, 
          errors: @property.errors.full_messages 
        }, status: :bad_request
      end
    else
      render json: { 
        success: false, 
        errors: @property.errors.full_messages 
      }, status: :bad_request
    end
  end

  def update
    if @property.update(property_params)
      attach_images if params[:images].present?
      render 'api/properties/show', status: :ok
    else
      render json: { 
        success: false, 
        errors: @property.errors.full_messages 
      }, status: :bad_request
    end
  end

  def destroy
    @property.destroy
    render json: { success: true }, status: :ok
  end

  private

  def set_property
    @property = Property.find_by(id: params[:id])
  end

  def check_property_owner
    unless @property && @property.user == current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def property_params
    params.permit(
      :title, :description, :city, :country, :property_type,
      :price_per_night, :max_guests, :bedrooms, :beds, :baths,
      :amenities, :policies, :neighborhood
    )
  end

  def attach_images
    @property.images.purge if params[:replace_images] == 'true'
    
    params[:images].each do |image|
      @property.images.attach(image) if image.present?
    end
  end

  def authenticate_user!
    if current_user.blank?
      render json: { success: false, error: 'You must be logged in' }, status: :unauthorized
    end
  end
end