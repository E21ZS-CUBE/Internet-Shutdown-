const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Shutdown = require('./models/Shutdown');
const State = require('./models/State');

dotenv.config();

const indianStates = require('./data/indianStates.json');
const mockShutdowns = require('./data/mockShutdowns');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internetshutdowns', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Shutdown.deleteMany({});
    await State.deleteMany({});

    // Seed states
    console.log('Seeding states...');
    if (indianStates && indianStates.length > 0) {
      await State.insertMany(indianStates);
      console.log(`✓ ${indianStates.length} states seeded`);
    }

    // Seed shutdowns
    console.log('Seeding shutdowns...');
    if (mockShutdowns && mockShutdowns.length > 0) {
      await Shutdown.insertMany(mockShutdowns);
      console.log(`✓ ${mockShutdowns.length} shutdowns seeded`);
    }

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
