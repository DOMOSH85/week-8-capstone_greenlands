// Utility functions for testing

// Mock data for testing
export const mockUserData = {
  farmer: {
    _id: 'farmer123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'farmer',
    location: 'Nairobi, Kenya',
    farmSize: 50,
    phoneNumber: '+254712345678'
  },
  government: {
    _id: 'gov123',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'government',
    department: 'Agriculture',
    phoneNumber: '+254712345679'
  }
};

export const mockLandData = [
  {
    _id: 'land123',
    farmer: 'farmer123',
    name: 'Parcel A',
    size: 25,
    location: {
      address: 'Nairobi, Kenya'
    },
    soilType: 'loamy',
    crops: [
      {
        name: 'Maize',
        plantingDate: '2023-03-15',
        harvestDate: '2023-07-20',
        yield: 5.2
      }
    ],
    waterUsage: [
      {
        date: '2023-04-01',
        amount: 500
      },
      {
        date: '2023-04-08',
        amount: 450
      }
    ],
    sustainabilityScore: 85
  },
  {
    _id: 'land456',
    farmer: 'farmer123',
    name: 'Parcel B',
    size: 25,
    location: {
      address: 'Nairobi, Kenya'
    },
    soilType: 'clay',
    crops: [
      {
        name: 'Beans',
        plantingDate: '2023-04-10',
        harvestDate: '2023-08-15',
        yield: 3.8
      }
    ],
    waterUsage: [
      {
        date: '2023-05-01',
        amount: 300
      }
    ],
    sustainabilityScore: 72
  }
];

export const mockAnalyticsData = {
  totalFarmers: 1240,
  totalLands: 2480,
  totalLandArea: 49600,
  soilDistribution: [
    { _id: 'clay', count: 450 },
    { _id: 'sandy', count: 320 },
    { _id: 'silty', count: 280 },
    { _id: 'peaty', count: 150 },
    { _id: 'chalky', count: 180 },
    { _id: 'loamy', count: 1100 }
  ],
  sustainabilityScores: [
    { _id: 'Low', count: 240 },
    { _id: 'Medium', count: 680 },
    { _id: 'High', count: 320 }
  ]
};

// Mock API functions for testing
export const mockAPI = {
  auth: {
    login: async (credentials) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (credentials.email === 'john@example.com' && credentials.password === 'password') {
            resolve({
              ...mockUserData.farmer,
              token: 'mock-jwt-token'
            });
          } else if (credentials.email === 'jane@example.com' && credentials.password === 'password') {
            resolve({
              ...mockUserData.government,
              token: 'mock-jwt-token'
            });
          } else {
            resolve({ error: 'Invalid credentials' });
          }
        }, 500);
      });
    },
    
    register: async (userData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...userData,
            _id: 'newuser123',
            token: 'mock-jwt-token'
          });
        }, 500);
      });
    }
  },
  
  land: {
    getLands: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockLandData);
        }, 300);
      });
    },
    
    getLand: async (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const land = mockLandData.find(l => l._id === id);
          if (land) {
            resolve(land);
          } else {
            resolve({ error: 'Land not found' });
          }
        }, 300);
      });
    }
  },
  
  government: {
    getAnalytics: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockAnalyticsData);
        }, 300);
      });
    }
  }
};

export default {
  mockUserData,
  mockLandData,
  mockAnalyticsData,
  mockAPI
};