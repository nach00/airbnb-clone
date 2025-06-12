class CreateBookings < ActiveRecord::Migration[7.2]
  def change
    create_table :bookings do |t|
      t.references :user, null: false, foreign_key: true
      t.references :property, null: false, foreign_key: true
      t.date :start_date, null: false
      t.date :end_date, null: false
      t.integer :guests, null: false

      t.timestamps
    end

    add_index :bookings, [:property_id, :start_date, :end_date]
  end
end
