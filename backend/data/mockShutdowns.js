const mockShutdowns = [
  {
    state: 'Manipur',
    stateCode: 'MN',
    district: 'Imphal West',
    startDate: new Date('2024-08-01T10:30:00Z'),
    endDate: new Date('2024-08-03T14:15:00Z'),
    durationHours: 52,
    shutdownType: 'FULL',
    reason: 'Post-election violence and communal tensions',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com/news/manipur-shutdown-august',
    sourceDocument: 'Government Order 2024-08-01',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 120, coverageAreaSqKm: 45.5 },
      { operatorName: 'Jio', towersBlocked: 95, coverageAreaSqKm: 38.2 },
      { operatorName: 'Vi', towersBlocked: 60, coverageAreaSqKm: 22.1 }
    ]
  },
  {
    state: 'Maharashtra',
    stateCode: 'MH',
    district: 'Pune',
    startDate: new Date('2024-09-15T08:00:00Z'),
    endDate: new Date('2024-09-15T20:00:00Z'),
    durationHours: 12,
    shutdownType: 'FULL',
    reason: 'Harthal and protest march',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com/news/pune-shutdown-september',
    sourceDocument: 'News Report',
    sourceType: 'NEWS_REPORT',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 45, coverageAreaSqKm: 12.3 },
      { operatorName: 'Jio', towersBlocked: 38, coverageAreaSqKm: 10.1 }
    ]
  },
  {
    state: 'Jammu & Kashmir',
    stateCode: 'JK',
    district: 'Srinagar',
    startDate: new Date('2024-07-20T00:00:00Z'),
    endDate: null,
    durationHours: 1344,
    shutdownType: 'THROTTLED',
    throttlingFrom: '4G',
    throttlingTo: '3G',
    reason: 'Security measures post-incident',
    reasonCategory: 'SECURITY',
    sourceUrl: 'https://example.com/news/kashmir-throttling',
    sourceDocument: 'Government Order 2024-07-20',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 200, coverageAreaSqKm: 78.5 },
      { operatorName: 'BSNL', towersBlocked: 150, coverageAreaSqKm: 65.2 }
    ]
  },
  {
    state: 'Delhi',
    stateCode: 'DL',
    district: 'South Delhi',
    startDate: new Date('2024-09-22T14:00:00Z'),
    endDate: new Date('2024-09-22T18:00:00Z'),
    durationHours: 4,
    shutdownType: 'FULL',
    reason: 'Exam security measures',
    reasonCategory: 'EXAM',
    sourceUrl: 'https://example.com/news/delhi-exam-shutdown',
    sourceDocument: 'Exam Safety Protocol',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: true,
    operators: [
      { operatorName: 'Jio', towersBlocked: 30, coverageAreaSqKm: 8.2 }
    ]
  },
  {
    state: 'Bihar',
    stateCode: 'BR',
    district: 'Patna',
    startDate: new Date('2024-08-10T06:00:00Z'),
    endDate: new Date('2024-08-10T18:00:00Z'),
    durationHours: 12,
    shutdownType: 'FULL',
    reason: 'Entrance exam administration',
    reasonCategory: 'EXAM',
    sourceUrl: 'https://example.com/news/bihar-exam',
    sourceDocument: 'Exam Notification',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 55, coverageAreaSqKm: 18.5 }
    ]
  },
  {
    state: 'Karnataka',
    stateCode: 'KA',
    district: 'Bangalore',
    startDate: new Date('2024-09-05T09:00:00Z'),
    endDate: new Date('2024-09-05T17:00:00Z'),
    durationHours: 8,
    shutdownType: 'FULL',
    reason: 'Communal tensions',
    reasonCategory: 'VIOLENCE',
    sourceUrl: 'https://example.com/news/bangalore-violence',
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
    startDate: new Date('2024-08-25T12:00:00Z'),
    endDate: new Date('2024-08-25T20:00:00Z'),
    durationHours: 8,
    shutdownType: 'THROTTLED',
    throttlingFrom: '5G',
    throttlingTo: '4G',
    reason: 'Political protest and rally',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com/news/chennai-protest',
    sourceDocument: 'News Coverage',
    sourceType: 'NEWS_REPORT',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 100, coverageAreaSqKm: 42.1 },
      { operatorName: 'Vi', towersBlocked: 80, coverageAreaSqKm: 31.5 }
    ]
  },
  {
    state: 'West Bengal',
    stateCode: 'WB',
    district: 'Kolkata',
    startDate: new Date('2024-07-10T07:00:00Z'),
    endDate: new Date('2024-07-10T16:00:00Z'),
    durationHours: 9,
    shutdownType: 'FULL',
    reason: 'Political rally management',
    reasonCategory: 'PROTEST',
    sourceUrl: 'https://example.com/news/kolkata-rally',
    sourceDocument: 'Administration Notice',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 70, coverageAreaSqKm: 25.3 }
    ]
  },
  {
    state: 'Haryana',
    stateCode: 'HR',
    district: 'Faridabad',
    startDate: new Date('2024-09-18T15:00:00Z'),
    endDate: new Date('2024-09-18T21:00:00Z'),
    durationHours: 6,
    shutdownType: 'THROTTLED',
    throttlingFrom: '4G',
    throttlingTo: '3G',
    reason: 'Security protocols',
    reasonCategory: 'SECURITY',
    sourceUrl: 'https://example.com/news/faridabad',
    sourceDocument: 'Official Directive',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: false,
    operators: [
      { operatorName: 'Jio', towersBlocked: 45, coverageAreaSqKm: 15.8 }
    ]
  },
  {
    state: 'Rajasthan',
    stateCode: 'RJ',
    district: 'Jaipur',
    startDate: new Date('2024-06-28T10:00:00Z'),
    endDate: new Date('2024-06-28T14:00:00Z'),
    durationHours: 4,
    shutdownType: 'FULL',
    reason: 'Exam security',
    reasonCategory: 'EXAM',
    sourceUrl: 'https://example.com/news/jaipur-exam',
    sourceDocument: 'Exam Board Order',
    sourceType: 'GOVERNMENT_ORDER',
    isVerified: true,
    operators: [
      { operatorName: 'Airtel', towersBlocked: 35, coverageAreaSqKm: 9.5 }
    ]
  }
];

module.exports = mockShutdowns;
