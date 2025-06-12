Rails.application.routes.draw do
  root to: 'static_pages#home'
  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/booking/:id/success' => 'static_pages#booking_success'

  namespace :api do
    # Add routes below this line
    resources :users, only: [:create]
    resources :sessions, only: %i[create destroy]
    resources :properties, only: %i[index show]
    resources :bookings, only: %i[create show]
    resources :charges, only: [:create]

    get '/authenticated' => 'sessions#authenticated'
    post '/charges/mark_complete' => 'charges#mark_complete'
  end
end
