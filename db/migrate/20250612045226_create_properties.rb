class CreateProperties < ActiveRecord::Migration[7.2]
  def change
    create_table :properties do |t|
      t.string :title
      t.string :description
      t.string :city
      t.string :country
      t.string :property_type
      t.integer :price_per_night
      t.integer :max_guests
      t.integer :bedrooms
      t.integer :beds
      t.integer :baths
      t.string :image_url
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
