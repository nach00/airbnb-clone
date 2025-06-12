json.success true
json.checkout_session_id checkout_session_id
json.charge do
  json.id charge.id
  json.booking_id charge.booking_id
  json.complete charge.complete
  json.created_at charge.created_at
end