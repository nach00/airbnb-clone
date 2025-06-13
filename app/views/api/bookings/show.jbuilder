json.booking do
  json.id @booking.id
  json.start_date @booking.start_date
  json.end_date @booking.end_date
  json.guests @booking.guests
  json.nights @booking.nights
  json.total_amount @booking.total_amount
  json.is_paid @booking.is_paid?
  json.created_at @booking.created_at
  json.updated_at @booking.updated_at
  
  json.property do
    json.id @booking.property.id
    json.title @booking.property.title
    json.description @booking.property.description
    json.city @booking.property.city
    json.country @booking.property.country
    json.property_type @booking.property.property_type
    json.price_per_night @booking.property.price_per_night
    json.max_guests @booking.property.max_guests
    json.bedrooms @booking.property.bedrooms
    json.beds @booking.property.beds
    json.baths @booking.property.baths
    json.amenities @booking.property.amenities
    json.policies @booking.property.policies
    json.neighborhood @booking.property.neighborhood
    json.image_url @booking.property.primary_image_url
    json.image_urls @booking.property.all_image_urls
  end
  
  json.user do
    json.id @booking.user.id
    json.username @booking.user.username
    json.email @booking.user.email
  end
  
  if @booking.charge
    json.charge do
      json.id @booking.charge.id
      json.checkout_session_id @booking.charge.checkout_session_id
      json.complete @booking.charge.complete
      json.created_at @booking.charge.created_at
      json.updated_at @booking.charge.updated_at
    end
  else
    json.charge nil
  end
end