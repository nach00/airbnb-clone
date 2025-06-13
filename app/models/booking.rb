class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :property
  has_one :charge, dependent: :destroy

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :guests, presence: true, numericality: { 
    greater_than: 0, 
    less_than_or_equal_to: 16 
  }
  
  validate :end_date_after_start_date
  validate :start_date_cannot_be_in_past
  validate :no_date_conflicts
  validate :guests_within_property_limit

  def is_paid?
    charge&.complete == true
  end

  def total_amount
    return 0 unless start_date && end_date && property
    nights = (end_date - start_date).to_i
    nights * property.price_per_night
  end

  def nights
    return 0 unless start_date && end_date
    (end_date - start_date).to_i
  end

  private

  def end_date_after_start_date
    return unless start_date && end_date
    
    errors.add(:end_date, "must be after start date") if end_date <= start_date
  end

  def start_date_cannot_be_in_past
    return unless start_date
    
    errors.add(:start_date, "cannot be in the past") if start_date < Date.current
  end

  def no_date_conflicts
    return unless start_date && end_date && property_id

    conflicting_bookings = property.bookings
                                  .where.not(id: id)
                                  .where(
                                    "(start_date <= ? AND end_date > ?) OR (start_date < ? AND end_date >= ?) OR (start_date >= ? AND end_date <= ?)",
                                    start_date, start_date,
                                    end_date, end_date,
                                    start_date, end_date
                                  )

    errors.add(:base, "Property is not available for the selected dates") if conflicting_bookings.exists?
  end

  def guests_within_property_limit
    return unless guests && property

    errors.add(:guests, "exceeds property maximum of #{property.max_guests}") if guests > property.max_guests
  end
end
