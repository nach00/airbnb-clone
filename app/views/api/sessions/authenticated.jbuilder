json.authenticated true
json.user do
  json.user_id @user.id
  json.username @user.username
  json.email @user.email
end
