class Charge < ApplicationRecord
  belongs_to :booking

  validates :checkout_session_id, presence: true, uniqueness: true
  validates :complete, inclusion: { in: [true, false] }
end
