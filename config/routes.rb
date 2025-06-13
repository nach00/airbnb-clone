Rails.application.routes.draw do
  root to: 'static_pages#home'
  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/booking/:id/success' => 'booking_success#show'
  get '/my-bookings' => 'static_pages#my_bookings'
  get '/host-bookings' => 'static_pages#host_bookings'
  get '/add-property' => 'static_pages#add_property'
  get '/edit-property/:id' => 'static_pages#edit_property'

  namespace :api do
    # Add routes below this line
    resources :users, only: [:create]
    resources :sessions, only: %i[create]
    delete '/sessions' => 'sessions#destroy'
    resources :properties, only: %i[index show create update destroy]
    resources :bookings, only: %i[create show]
    resources :charges, only: [:create]

    # Booking management routes
    get '/my-bookings' => 'user_bookings#index'
    get '/my-bookings/:id' => 'user_bookings#show'
    get '/host-bookings' => 'host_bookings#index'
    get '/host-bookings/:id' => 'host_bookings#show'

    get '/authenticated' => 'sessions#authenticated'
    post '/charges/mark_complete' => 'charges#mark_complete'
  end
end
