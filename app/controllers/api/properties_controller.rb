class Api::PropertiesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_property, only: [:show, :update, :destroy]
  before_action :check_property_owner, only: [:update, :destroy]
  
  rescue_from ActionDispatch::Http::Parameters::ParseError do |exception|
    render json: { success: false, error: "Invalid request format" }, status: :bad_request
  end

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
    Rails.logger.info "Content-Type: #{request.content_type}"
    Rails.logger.info "Raw params: #{params.inspect}"
    Rails.logger.info "Request body: #{request.body.read}"
    request.body.rewind
    
    begin
      filtered_params = property_params
      Rails.logger.info "Filtered params: #{filtered_params.inspect}"
      @property = current_user.properties.build(filtered_params)
    rescue => e
      Rails.logger.error "Error in property_params: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join('\n')}"
      render json: { success: false, error: "Parameter error: #{e.message}" }, status: :bad_request
      return
    end
    
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
    params.require(:property).permit(
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
    Rails.logger.info "Authenticating user... current_user: #{current_user.inspect}"
    if current_user.blank?
      Rails.logger.warn "Authentication failed - no current user"
      render json: { success: false, error: 'You must be logged in' }, status: :unauthorized
    else
      Rails.logger.info "Authentication successful for user: #{current_user.id}"
    end
  end
end