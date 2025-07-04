class User < ApplicationRecord
  has_many :sessions
  has_many :properties, dependent: :destroy
  has_many :bookings, dependent: :destroy

  validates :username, presence: true, length: { minimum: 3, maximum: 64 }
  validates :password, presence: true, length: { minimum: 8, maximum: 64 }
  validates :email, presence: true, length: { minimum: 5, maximum: 500 }

  validates_uniqueness_of :username
  validates_uniqueness_of :email

  before_save :hash_password, if: :password_changed?

  private

  def hash_password
    self.password = BCrypt::Password.create(password)
  end
end
