# Create sample users
user1 = User.create!(
  username: 'john_host',
  email: 'john@example.com',
  password: 'password123'
)

user2 = User.create!(
  username: 'jane_host',
  email: 'jane@example.com',
  password: 'password123'
)

user3 = User.create!(
  username: 'guest_user',
  email: 'guest@example.com',
  password: 'password123'
)

# Create sample properties
Property.create!([
  {
    title: 'Cozy Downtown Apartment',
    description: 'Beautiful 1-bedroom apartment in the heart of the city. Perfect for business travelers and couples. Walking distance to restaurants, shops, and public transportation.',
    city: 'New York',
    country: 'United States',
    property_type: 'Apartment',
    price_per_night: 150,
    max_guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    user: user1
  },
  {
    title: 'Spacious Family Home',
    description: 'Large 4-bedroom house with backyard, perfect for families. Quiet neighborhood with easy access to schools and parks. Fully equipped kitchen and living areas.',
    city: 'Los Angeles',
    country: 'United States',
    property_type: 'House',
    price_per_night: 275,
    max_guests: 8,
    bedrooms: 4,
    beds: 4,
    baths: 3,
    image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    user: user1
  },
  {
    title: 'Modern Studio Loft',
    description: 'Stylish studio loft with high ceilings and modern amenities. Great for solo travelers or couples. Located in trendy arts district.',
    city: 'San Francisco',
    country: 'United States',
    property_type: 'Loft',
    price_per_night: 120,
    max_guests: 2,
    bedrooms: 0,
    beds: 1,
    baths: 1,
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    user: user2
  },
  {
    title: 'Luxury Penthouse Suite',
    description: 'Stunning penthouse with panoramic city views. Premium finishes, gourmet kitchen, and private terrace. Perfect for special occasions.',
    city: 'Miami',
    country: 'United States',
    property_type: 'Penthouse',
    price_per_night: 450,
    max_guests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 2,
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    user: user2
  },
  {
    title: 'Charming Garden Cottage',
    description: 'Peaceful cottage surrounded by beautiful gardens. Perfect getaway from city life. Cozy fireplace and private outdoor space.',
    city: 'Portland',
    country: 'United States',
    property_type: 'Cottage',
    price_per_night: 95,
    max_guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    user: user1
  },
  {
    title: 'Beachfront Villa',
    description: 'Spectacular oceanfront villa with private beach access. Multiple bedrooms, infinity pool, and breathtaking sunrise views.',
    city: 'Malibu',
    country: 'United States',
    property_type: 'Villa',
    price_per_night: 650,
    max_guests: 10,
    bedrooms: 5,
    beds: 6,
    baths: 4,
    image_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c38a?w=800',
    user: user2
  },
  {
    title: 'Urban Townhouse',
    description: 'Contemporary 3-bedroom townhouse in vibrant neighborhood. Modern kitchen, workspace, and rooftop deck with city views.',
    city: 'Chicago',
    country: 'United States',
    property_type: 'Townhouse',
    price_per_night: 180,
    max_guests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 2,
    image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    user: user1
  },
  {
    title: 'Rustic Mountain Cabin',
    description: 'Cozy log cabin nestled in the mountains. Perfect for outdoor enthusiasts. Fireplace, hiking trails nearby, and stunning nature views.',
    city: 'Aspen',
    country: 'United States',
    property_type: 'Cabin',
    price_per_night: 200,
    max_guests: 6,
    bedrooms: 2,
    beds: 3,
    baths: 1,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    user: user2
  }
])

puts "Created #{User.count} users and #{Property.count} properties"