class Api::PropertiesController < ApplicationController
  def index
    @properties = Property.page(params[:page]).per(6).order(:id)
    render 'api/properties/index', status: :ok
  end

  def show
    @property = Property.find_by(id: params[:id])
    
    if @property
      render 'api/properties/show', status: :ok
    else
      render json: { error: 'Property not found' }, status: :not_found
    end
  end
end