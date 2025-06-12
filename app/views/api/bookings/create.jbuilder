json.success true
json.booking do
  json.id booking.id
  json.property_id booking.property_id
  json.start_date booking.start_date
  json.end_date booking.end_date
  json.guests booking.guests
  json.created_at booking.created_at
  json.property do
    json.title booking.property.title
    json.price_per_night booking.property.price_per_night
  end
end