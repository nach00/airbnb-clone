FactoryBot.define do
  factory :charge do
    booking { nil }
    checkout_session_id { "MyString" }
    complete { false }
  end
end
