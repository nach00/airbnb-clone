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
    json.city booking.property.city
    json.country booking.property.country
  end
  json.charge do
    if booking.charge
      json.id booking.charge.id
      json.complete booking.charge.complete
      json.checkout_session_id booking.charge.checkout_session_id
    else
      json.null!
    end
  end
end