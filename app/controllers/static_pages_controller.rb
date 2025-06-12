class StaticPagesController < ApplicationController
  def home
  end

  def property
    @property_id = params[:id]
  end

  def login
  end

  def booking_success
    @booking_id = params[:id]
  end
end
