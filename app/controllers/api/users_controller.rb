module Api
  class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token
    def create
      @user = User.new(user_params)

      if @user.save
        # Automatically create a session for the new user
        session = @user.sessions.create
        cookies.permanent.signed[:airbnb_session_token] = {
          value: session.token,
          httponly: true
        }
        
        render 'api/users/create'
      else
        render json: { success: false }
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end
