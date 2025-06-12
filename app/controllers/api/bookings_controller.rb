class Api::BookingsController < ApplicationController
  before_action :authenticate_user!

  def create
    booking_params_hash = booking_params
    booking = current_user.bookings.build(booking_params_hash)

    if booking.save
      render 'api/bookings/create', locals: { booking: booking }, status: :created
    else
      render json: { success: false, errors: booking.errors.full_messages }, status: :bad_request
    end
  end

  def show
    booking = current_user.bookings.find_by(id: params[:id])
    
    if booking
      render 'api/bookings/show', locals: { booking: booking }, status: :ok
    else
      render json: { success: false, error: 'Booking not found' }, status: :not_found
    end
  end

  private

  def booking_params
    params.require(:booking).permit(:property_id, :start_date, :end_date, :guests)
  end

  def authenticate_user!
    if current_user.blank?
      render json: { success: false, error: 'You must be logged in to make a booking' }, status: :unauthorized
    end
  end
end