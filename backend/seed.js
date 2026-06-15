// Seed script to preload demo data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Activity = require('./models/Activity');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Activity.deleteMany({});

    // Create demo user
    const user = new User({
      name: 'Sejal Jain',
      email: 'sejal6249@gmail.com',
      password: 'password123', // Will be hashed
    });
    await user.save();
    console.log('✅ Demo user created');

    // Create 24 sample activities
    const activities = [
      // Transport (10 activities - 43%)
      { category: 'Transport', description: 'Drove 40 km in SUV', quantity: 40, unit: 'km', emission: 8.5 },
      { category: 'Transport', description: 'Took taxi for 15 km', quantity: 15, unit: 'km', emission: 3.2 },
      { category: 'Transport', description: 'Flew from Delhi to Mumbai', quantity: 1, unit: 'flight', emission: 45.0 },
      { category: 'Transport', description: 'Used metro for commute', quantity: 1, unit: 'trip', emission: 0.8 },
      { category: 'Transport', description: 'Drove 25 km to office', quantity: 25, unit: 'km', emission: 5.3 },
      { category: 'Transport', description: 'Took Uber for 10 km', quantity: 10, unit: 'km', emission: 2.1 },
      { category: 'Transport', description: 'Car trip to grocery store', quantity: 5, unit: 'km', emission: 1.1 },
      { category: 'Transport', description: 'Motorcycle ride 20 km', quantity: 20, unit: 'km', emission: 2.8 },
      { category: 'Transport', description: 'Drove for work meeting', quantity: 30, unit: 'km', emission: 6.4 },
      { category: 'Transport', description: 'Weekend drive', quantity: 50, unit: 'km', emission: 10.7 },

      // Energy (8 activities - 32%)
      { category: 'Energy', description: 'Left AC on for 6 hours', quantity: 6, unit: 'hours', emission: 4.2 },
      { category: 'Energy', description: 'Used heater for 3 hours', quantity: 3, unit: 'hours', emission: 1.8 },
      { category: 'Energy', description: 'Washing machine cycle', quantity: 1, unit: 'cycle', emission: 0.7 },
      { category: 'Energy', description: 'Air conditioning all night', quantity: 8, unit: 'hours', emission: 5.6 },
      { category: 'Energy', description: 'Electric oven cooking', quantity: 1, unit: 'hour', emission: 1.2 },
      { category: 'Energy', description: 'Computer usage', quantity: 8, unit: 'hours', emission: 2.4 },
      { category: 'Energy', description: 'Television and lights', quantity: 4, unit: 'hours', emission: 1.1 },
      { category: 'Energy', description: 'Hot water shower', quantity: 1, unit: 'shower', emission: 1.3 },

      // Diet (6 activities - 25%)
      { category: 'Diet', description: 'Had steak dinner', quantity: 1, unit: 'meal', emission: 6.8 },
      { category: 'Diet', description: 'Chicken lunch', quantity: 1, unit: 'meal', emission: 3.2 },
      { category: 'Diet', description: 'Vegetarian breakfast', quantity: 1, unit: 'meal', emission: 0.8 },
      { category: 'Diet', description: 'Fish dinner', quantity: 1, unit: 'meal', emission: 4.5 },
      { category: 'Diet', description: 'Pizza with dairy', quantity: 1, unit: 'meal', emission: 2.1 },
      { category: 'Diet', description: 'Bought bottled drinks', quantity: 2, unit: 'bottles', emission: 1.5 },
    ];

    // Save activities with dates spread over last 30 days
    for (let i = 0; i < activities.length; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      const activity = new Activity({
        userId: user._id,
        ...activities[i],
        createdAt: date,
        updatedAt: date,
      });
      await activity.save();
    }

    console.log('✅ 24 sample activities created');
    console.log('📊 Total emissions: 142.4 kg CO₂e');
    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
