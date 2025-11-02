// backend/mockData.js
// This file contains all mock data for the application
// In production, this data would come from PostgreSQL database

const mockShutdowns = [
  {
    id: '1',
    state: 'Manipur',
    stateCode: 'MN',
    district: 'Imphal West',
    startDate: '2024-08-01T10:30:00Z',
    endDate: '2024-08-03T14:15:00Z',
    durationHours: 52,
    shutdownType: 'FULL',
    reason: 'Post-election violence and communal tensions',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com/news/manipur-shutdown-august',
    sourceDocument: 'Government Order 2024-08-01',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 120, coverageArea: 45.5 },
      { name: 'Jio', towersBlocked: 95, coverageArea: 38.2 },
      { name: 'Vi', towersBlocked: 60, coverageArea: 22.1 }
    ],
    throttlingDetails: null
  },
  {
    id: '2',
    state: 'Maharashtra',
    stateCode: 'MH',
    district: 'Pune',
    startDate: '2024-09-15T08:00:00Z',
    endDate: '2024-09-15T20:00:00Z',
    durationHours: 12,
    shutdownType: 'FULL',
    reason: 'Harthal and protest march',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com/news/pune-shutdown-september',
    sourceDocument: 'News Report',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 45, coverageArea: 12.3 },
      { name: 'Jio', towersBlocked: 38, coverageArea: 10.1 }
    ],
    throttlingDetails: null
  },
  {
    id: '3',
    state: 'Kashmir',
    stateCode: 'JK',
    district: 'Srinagar',
    startDate: '2024-07-20T00:00:00Z',
    endDate: null,
    durationHours: 1344,
    shutdownType: 'THROTTLED',
    reason: 'Security measures post-incident',
    reasonCategory: 'SECURITY',
    sourceUrl: 'https://example.com/news/kashmir-throttling',
    sourceDocument: 'Government Order 2024-07-20',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 200, coverageArea: 78.5 },
      { name: 'BSNL', towersBlocked: 150, coverageArea: 65.2 }
    ],
    throttlingDetails: { from: '4G', to: '3G' }
  },
  {
    id: '4',
    state: 'Delhi',
    stateCode: 'DL',
    district: 'South Delhi',
    startDate: '2024-09-22T14:00:00Z',
    endDate: '2024-09-22T18:00:00Z',
    durationHours: 4,
    shutdownType: 'FULL',
    reason: 'Exam security measures',
    reasonCategory: 'EXAM',
    sourceUrl: 'https://example.com/news/delhi-exam-shutdown',
    sourceDocument: 'Exam Safety Protocol',
    isVerified: true,
    operators: [
      { name: 'Jio', towersBlocked: 30, coverageArea: 8.2 }
    ],
    throttlingDetails: null
  },
  {
    id: '5',
    state: 'Bihar',
    stateCode: 'BR',
    district: 'Patna',
    startDate: '2024-08-10T06:00:00Z',
    endDate: '2024-08-10T18:00:00Z',
    durationHours: 12,
    shutdownType: 'FULL',
    reason: 'Entrance exam administration',
    reasonCategory: 'EXAM',
    sourceUrl: 'https://example.com/news/bihar-exam',
    sourceDocument: 'Exam Notification',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 55, coverageArea: 18.5 }
    ],
    throttlingDetails: null
  },
  {
    id: '6',
    state: 'Karnataka',
    stateCode: 'KA',
    district: 'Bangalore',
    startDate: '2024-09-05T09:00:00Z',
    endDate: '2024-09-05T17:00:00Z',
    durationHours: 8,
    shutdownType: 'FULL',
    reason: 'Communal tensions',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com/news/bangalore-violence',
    sourceDocument: 'Police Report',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 90, coverageArea: 35.2 },
      { name: 'Jio', towersBlocked: 75, coverageArea: 28.9 }
    ],
    throttlingDetails: null
  },
  {
    id: '7',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    district: 'Chennai',
    startDate: '2024-08-25T12:00:00Z',
    endDate: '2024-08-25T20:00:00Z',
    durationHours: 8,
    shutdownType: 'THROTTLED',
    reason: 'Political protest and rally',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com/news/chennai-protest',
    sourceDocument: 'News Coverage',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 100, coverageArea: 42.1 },
      { name: 'Vi', towersBlocked: 80, coverageArea: 31.5 }
    ],
    throttlingDetails: { from: '5G', to: '4G' }
  },
  {
    id: '8',
    state: 'Manipur',
    stateCode: 'MN',
    district: 'Imphal East',
    startDate: '2024-08-05T11:00:00Z',
    endDate: '2024-08-06T09:00:00Z',
    durationHours: 22,
    shutdownType: 'FULL',
    reason: 'Ongoing communal violence',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com/news/imphal-east',
    sourceDocument: 'Emergency Order',
    isVerified: true,
    operators: [
      { name: 'Jio', towersBlocked: 85, coverageArea: 34.2 }
    ],
    throttlingDetails: null
  },
  {
    id: '9',
    state: 'West Bengal',
    stateCode: 'WB',
    district: 'Kolkata',
    startDate: '2024-07-10T07:00:00Z',
    endDate: '2024-07-10T16:00:00Z',
    durationHours: 9,
    shutdownType: 'FULL',
    reason: 'Political rally management',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com/news/kolkata-rally',
    sourceDocument: 'Administration Notice',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 70, coverageArea: 25.3 }
    ],
    throttlingDetails: null
  },
  {
    id: '10',
    state: 'Haryana',
    stateCode: 'HR',
    district: 'Faridabad',
    startDate: '2024-09-18T15:00:00Z',
    endDate: '2024-09-18T21:00:00Z',
    durationHours: 6,
    shutdownType: 'THROTTLED',
    reason: 'Security protocols',
    reasonCategory: 'SECURITY',
    sourceUrl: 'https://example.com/news/faridabad',
    sourceDocument: 'Official Directive',
    isVerified: false,
    operators: [
      { name: 'Jio', towersBlocked: 45, coverageArea: 15.8 }
    ],
    throttlingDetails: { from: '4G', to: '3G' }
  },
  {
    id: '11',
    state: 'Rajasthan',
    stateCode: 'RJ',
    district: 'Jaipur',
    startDate: '2024-06-28T10:00:00Z',
    endDate: '2024-06-28T14:00:00Z',
    durationHours: 4,
    shutdownType: 'FULL',
    reason: 'Exam security',
    reasonCategory: 'EXAM',
    sourceUrl: 'https://example.com/news/jaipur-exam',
    sourceDocument: 'Exam Board Order',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 35, coverageArea: 9.5 }
    ],
    throttlingDetails: null
  },
  {
    id: '12',
    state: 'Assam',
    stateCode: 'AS',
    district: 'Guwahati',
    startDate: '2024-09-01T08:00:00Z',
    endDate: '2024-09-01T20:00:00Z',
    durationHours: 12,
    shutdownType: 'FULL',
    reason: 'Post-violence measures',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com/news/guwahati-violence',
    sourceDocument: 'Police Order',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 65, coverageArea: 28.3 },
      { name: 'BSNL', towersBlocked: 40, coverageArea: 15.2 }
    ],
    throttlingDetails: null
  },
  {
    id: '13',
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    district: 'Indore',
    startDate: '2024-08-12T09:00:00Z',
    endDate: '2024-08-12T17:00:00Z',
    durationHours: 8,
    shutdownType: 'THROTTLED',
    reason: 'Civil unrest management',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com/news/indore',
    sourceDocument: 'Government Notification',
    isVerified: true,
    operators: [
      { name: 'Airtel', towersBlocked: 50, coverageArea: 18.9 },
      { name: 'Jio', towersBlocked: 48, coverageArea: 17.2 }
    ],
    throttlingDetails: { from: '5G', to: '4G' }
  },
  {
    id: '14',
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    district: 'Lucknow',
    startDate: '2024-07-15T13:00:00Z',
    endDate: '2024-07-15T21:00:00Z',
    durationHours: 8,
    shutdownType: 'FULL',
    reason: 'Event security',
    reasonCategory: 'SECURITY',
    sourceUrl: 'https://example.com/news/lucknow',
    sourceDocument: 'Security Order',
    isVerified: true,
    operators: [
      { name: 'Jio', towersBlocked: 60, coverageArea: 22.5 }
    ],
    throttlingDetails: null
  }
];

const mockStates = [
  { code: 'MH', name: 'Maharashtra' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'BR', name: 'Bihar' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'HR', name: 'Haryana' },
  { code: 'AS', name: 'Assam' },
  { code: 'DL', name: 'Delhi' },
  { code: 'JK', name: 'Jammu & Kashmir' },
  { code: 'MN', name: 'Manipur' },
  { code: 'GJ', name: 'Gujarat' }
];

module.exports = { mockShutdowns, mockStates };