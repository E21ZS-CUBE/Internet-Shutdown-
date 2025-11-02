const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Shutdown = require('./models/Shutdown');

const mockData = [
  {
    state: 'Manipur',
    stateCode: 'MN',
    district: 'Imphal West',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-03'),
    durationHours: 52,
    shutdownType: 'FULL',
    reason: 'Post-election violence',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com',
    sourceDocument: 'Government Order',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 120, coverageAreaSqKm: 45.5 },
      { operatorName: 'Jio', towersBlocked: 95, coverageAreaSqKm: 38.2 }
    ]
  },
  {
    state: 'Maharashtra',
    stateCode: 'MH',
    district: 'Pune',
    startDate: new Date('2024-09-15'),
    endDate: new Date('2024-09-15'),
    durationHours: 12,
    shutdownType: 'FULL',
    reason: 'Harthal and protest',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com',
    sourceDocument: 'News Report',
    sourceType: 'NEWS_REPORT',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 45, coverageAreaSqKm: 12.3 }
    ]
  },
  {
    state: 'Delhi',
    stateCode: 'DL',
    district: 'South Delhi',
    startDate: new Date('2024-09-22'),
    endDate: new Date('2024-09-22'),
    durationHours: 4,
    shutdownType: 'FULL',
    reason: 'Exam security',
    reasonCategory: 'EXAM',
    sourceUrl: 'https://example.com',
    sourceDocument: 'Exam Order',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: true,
    operators: [
      { operatorName: 'Jio', towersBlocked: 30, coverageAreaSqKm: 8.2 }
    ]
  },
  {
    state: 'Karnataka',
    stateCode: 'KA',
    district: 'Bangalore',
    startDate: new Date('2024-09-05'),
    endDate: new Date('2024-09-05'),
    durationHours: 8,
    shutdownType: 'FULL',
    reason: 'Communal tensions',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com',
    sourceDocument: 'Police Report',
    sourceType: 'OTHER',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 90, coverageAreaSqKm: 35.2 },
      { operatorName: 'Jio', towersBlocked: 75, coverageAreaSqKm: 28.9 }
    ]
  },
  {
    state: 'Tamil Nadu',
    stateCode: 'TN',
    district: 'Chennai',
    startDate: new Date('2024-08-25'),
    endDate: new Date('2024-08-25'),
    durationHours: 8,
    shutdownType: 'THROTTLED',
    throttlingFrom: '5G',
    throttlingTo: '4G',
    reason: 'Political protest',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com',
    sourceDocument: 'News Coverage',
    sourceType: 'NEWS_REPORT',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 100, coverageAreaSqKm: 42.1 }
    ]
  }
];

async function insertData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internetshutdowns');
    console.log('Connected to MongoDB');

    // Clear existing
    await Shutdown.deleteMany({});
    console.log('Cleared existing shutdowns');

    // Insert data
    const result = await Shutdown.insertMany(mockData);
    console.log(`✓ Inserted ${result.length} shutdowns`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

insertData();
