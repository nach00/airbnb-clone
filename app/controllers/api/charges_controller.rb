class Api::ChargesController < ApplicationController
  before_action :authenticate_user!, only: [:create]
  skip_before_action :verify_authenticity_token, only: [:mark_complete]

  def create
    booking = current_user.bookings.find_by(id: params[:booking_id])
    
    unless booking
      render json: { success: false, error: 'Booking not found' }, status: :not_found
      return
    end

    if booking.charge
      render json: { success: false, error: 'Booking already has a charge' }, status: :bad_request
      return
    end

    # Check if Stripe keys are placeholders (demo mode)
    stripe_key = ENV['STRIPE_SECRET_KEY']
    if stripe_key.blank? || stripe_key.include?('placeholder')
      # Demo mode - create a fake charge without Stripe
      charge = booking.create_charge!(
        checkout_session_id: "demo_session_#{booking.id}",
        complete: false
      )
      
      render json: { 
        success: true, 
        demo_mode: true,
        charge: {
          booking_id: booking.id,
          checkout_session_id: charge.checkout_session_id
        }
      }, status: :created
      return
    end

    begin
      nights = (booking.end_date - booking.start_date).to_i
      total_amount = nights * booking.property.price_per_night

      session = Stripe::Checkout::Session.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: booking.property.title,
              description: "#{nights} night#{nights > 1 ? 's' : ''} • #{booking.guests} guest#{booking.guests > 1 ? 's' : ''}",
              images: [booking.property.image_url],
            },
            unit_amount: total_amount * 100, # Stripe expects cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: "#{ENV['URL']}/booking/#{booking.id}/success",
        cancel_url: "#{ENV['URL']}/property/#{booking.property.id}",
        metadata: {
          booking_id: booking.id.to_s
        }
      })

      charge = booking.create_charge!(
        checkout_session_id: session.id,
        complete: false
      )

      render 'api/charges/create', locals: { charge: charge, checkout_session_id: session.id }, status: :created

    rescue Stripe::StripeError => e
      render json: { success: false, error: "Payment setup failed: #{e.message}" }, status: :bad_request
    rescue => e
      render json: { success: false, error: 'Payment setup failed' }, status: :internal_server_error
    end
  end

  def mark_complete
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = ENV['STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET']

    begin
      event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
    rescue JSON::ParserError
      render json: { error: 'Invalid payload' }, status: :bad_request
      return
    rescue Stripe::SignatureVerificationError
      render json: { error: 'Invalid signature' }, status: :bad_request
      return
    end

    case event['type']
    when 'checkout.session.completed'
      session = event['data']['object']
      charge = Charge.find_by(checkout_session_id: session['id'])
      
      if charge
        charge.update!(complete: true)
        Rails.logger.info "Payment completed for booking #{charge.booking.id}"
      else
        Rails.logger.error "Charge not found for session #{session['id']}"
      end
    end

    render json: { success: true }, status: :ok
  end

  private

  def authenticate_user!
    if current_user.blank?
      render json: { success: false, error: 'You must be logged in to create a charge' }, status: :unauthorized
    end
  end
end