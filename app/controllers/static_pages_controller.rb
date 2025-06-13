class StaticPagesController < ApplicationController
  def home
  end

  def property
    @property_id = params[:id]
  end

  def login
  end

  def my_bookings
  end

  def host_bookings
  end

  def add_property
  end

  def edit_property
    @property_id = params[:id]
  end
end
