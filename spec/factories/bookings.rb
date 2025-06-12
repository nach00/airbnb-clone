FactoryBot.define do
  factory :booking do
    user { nil }
    property { nil }
    start_date { "2025-06-12" }
    end_date { "2025-06-12" }
    guests { 1 }
  end
end
