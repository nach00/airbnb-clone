class ApplicationController < ActionController::Base
  
  private

  def current_user
    return @current_user if defined?(@current_user)
    
    token = cookies.signed[:airbnb_session_token]
    session = Session.find_by(token: token) if token
    @current_user = session&.user
  end

  def logged_in?
    current_user.present?
  end
end
