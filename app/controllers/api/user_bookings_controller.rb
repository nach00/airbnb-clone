class Api::UserBookingsController < ApplicationController
  before_action :authenticate_user!

  def index
    @bookings = current_user.bookings.includes(:property, :charge).order(created_at: :desc)
    render 'api/bookings/index', status: :ok
  end

  def show
    @booking = current_user.bookings.find_by(id: params[:id])
    
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