class BookingSuccessController < ApplicationController
  def show
    @booking = Booking.find_by(id: params[:id])
    
    unless @booking
      redirect_to root_path, alert: 'Booking not found'
      return
    end
    
    # Only show success page to the user who made the booking
    unless current_user && current_user == @booking.user
      redirect_to root_path, alert: 'Unauthorized'
      return
    end
  end
end