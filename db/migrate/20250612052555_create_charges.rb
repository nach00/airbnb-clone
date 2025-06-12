class CreateCharges < ActiveRecord::Migration[7.2]
  def change
    create_table :charges do |t|
      t.references :booking, null: false, foreign_key: true
      t.string :checkout_session_id, null: false
      t.boolean :complete, default: false, null: false

      t.timestamps
    end

    add_index :charges, :checkout_session_id, unique: true
  end
end
