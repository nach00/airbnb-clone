class AddDetailsToProperties < ActiveRecord::Migration[7.2]
  def change
    add_column :properties, :amenities, :text
    add_column :properties, :policies, :text
    add_column :properties, :neighborhood, :string
  end
end
