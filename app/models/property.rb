class Property < ApplicationRecord
  belongs_to :user
  has_many :bookings, dependent: :destroy
  has_many :charges, through: :bookings
  has_many_attached :images

  validates :title, presence: true, length: { maximum: 70 }
  validates :description, presence: true, length: { maximum: 2000 }
  validates :city, presence: true, length: { maximum: 200 }
  validates :country, presence: true, length: { maximum: 200 }
  validates :property_type, presence: true, length: { maximum: 200 }
  validates :price_per_night, presence: true, numericality: { 
    greater_than: 0, 
    less_than_or_equal_to: 99999 
  }
  validates :max_guests, presence: true, numericality: { 
    greater_than: 0, 
    less_than_or_equal_to: 20 
  }
  validates :bedrooms, presence: true, numericality: { 
    greater_than_or_equal_to: 0, 
    less_than_or_equal_to: 20 
  }
  validates :beds, presence: true, numericality: { 
    greater_than_or_equal_to: 0, 
    less_than_or_equal_to: 20 
  }
  validates :baths, presence: true, numericality: { 
    greater_than_or_equal_to: 0, 
    less_than_or_equal_to: 20 
  }
  validates :images, presence: true
  validates :amenities, length: { maximum: 2000 }
  validates :policies, length: { maximum: 2000 }
  validates :neighborhood, length: { maximum: 200 }

  def primary_image_url
    return nil unless images.attached?
    Rails.application.routes.url_helpers.rails_blob_url(images.first, only_path: true)
  end

  def all_image_urls
    return [] unless images.attached?
    images.map { |image| Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true) }
  end
end