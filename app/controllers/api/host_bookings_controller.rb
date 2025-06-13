class Api::HostBookingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @bookings = Booking.joins(:property)
                      .includes(:user, :property, :charge)
                      .where(properties: { user_id: current_user.id })
                      .order(created_at: :desc)
    render 'api/bookings/index', status: :ok
  end

  def show
    @booking = Booking.joins(:property)
                     .includes(:user, :property, :charge)
                     .where(properties: { user_id: current_user.id })
                     .find_by(id: params[:id])
    
    if @booking
      render 'api/bookings/show', status: :ok
    else
      render json: { error: 'Booking not found' }, status: :not_found
    end
  end

  private

  def authenticate_user!
    if current_user.blank?
      render json: { success: false, error: 'You must be logged in' }, status: :unauthorized
    end
  end
end