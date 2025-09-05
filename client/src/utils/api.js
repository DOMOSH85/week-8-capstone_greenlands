// Marketplace API
export const marketplaceAPI = {
  getItems: async () => {
    const res = await fetch('/api/marketplace');
    return res.json();
  },
  createItem: async (item, isFormData = false) => {
    const token = localStorage.getItem('token');
    let options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: item
    };
    if (!isFormData) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(item);
    }
    const res = await fetch('/api/marketplace', options);
    return res.json();
  },
  updateItemStatus: async (id, status) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/marketplace/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },
  deleteItem: async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/marketplace/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  }
};
// Utility functions for API calls

// Base URL for API requests
const API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL || 'https://sustainable-lands.onrender.com/api'
  : '/api';

// Generic fetch function with authentication
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Log token for debugging (remove in production)
  console.log('Token from localStorage:', token);
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  // Log the full request for debugging
  console.log('API Request:', {
    url: `${API_BASE_URL}${url}`,
    config
  });
  
  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  // Log the response for debugging
  console.log('API Response:', response);
  
  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  // Check if response is ok, if not throw an error with the message from server
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorDetails = {};
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      errorDetails = errorData;
    } catch (e) {
      // If we can't parse JSON, use the status text
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    // Log detailed error information for debugging
    console.error('API Error Details:', {
      url: `${API_BASE_URL}${url}`,
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      errorDetails
    });
    
    throw new Error(errorMessage);
  }
  
  return response;
};

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  login: async (credentials) => {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response.json();
  },
  
  getProfile: async () => {
    const response = await fetchWithAuth('/auth/profile');
    return response.json();
  }
};

// Land API calls
export const landAPI = {
  createLand: async (landData) => {
    const response = await fetchWithAuth('/land', {
      method: 'POST',
      body: JSON.stringify(landData)
    });
    return response.json();
  },
  
  getLands: async () => {
    const response = await fetchWithAuth('/land');
    return response.json();
  },
  
  getLand: async (id) => {
    const response = await fetchWithAuth(`/land/${id}`);
    return response.json();
  },
  
  updateLand: async (id, landData) => {
    const response = await fetchWithAuth(`/land/${id}`, {
      method: 'PUT',
      body: JSON.stringify(landData)
    });
    return response.json();
  },
  
  deleteLand: async (id) => {
    const response = await fetchWithAuth(`/land/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  addCrop: async (id, cropData) => {
    const response = await fetchWithAuth(`/land/${id}/crops`, {
      method: 'POST',
      body: JSON.stringify(cropData)
    });
    return response.json();
  },
  
  addWaterUsage: async (id, waterData) => {
    const response = await fetchWithAuth(`/land/${id}/water`, {
      method: 'POST',
      body: JSON.stringify(waterData)
    });
    return response.json();
  },
  
  addFertilizerUsage: async (id, fertilizerData) => {
    const response = await fetchWithAuth(`/land/${id}/fertilizer`, {
      method: 'POST',
      body: JSON.stringify(fertilizerData)
    });
    return response.json();
  },
  
  generateLandReport: async (id) => {
    const response = await fetchWithAuth(`/land/${id}/report`);
    return response.json();
  }
};

// Government API calls
export const governmentAPI = {
  getAnalytics: async () => {
    const response = await fetchWithAuth('/government/analytics');
    return response.json();
  },
  
  getFarmers: async () => {
    const response = await fetchWithAuth('/government/farmers');
    return response.json();
  },
  
  getLands: async () => {
    const response = await fetchWithAuth('/government/lands');
    return response.json();
  },
  
  // Policy management
  createPolicy: async (policyData) => {
    const response = await fetchWithAuth('/policies', {
      method: 'POST',
      body: JSON.stringify(policyData)
    });
    return response.json();
  },
  getPolicies: async () => {
    const response = await fetchWithAuth('/policies');
    return response.json();
  },
  updatePolicy: async (id, policyData) => {
    const response = await fetchWithAuth(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(policyData)
    });
    return response.json();
  },
  deletePolicy: async (id) => {
    const response = await fetchWithAuth(`/policies/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  notifyPolicy: async (id) => {
    const response = await fetchWithAuth(`/policies/${id}/notify`, {
      method: 'POST'
    });
    return response.json();
  },
  // Subsidy management
  createSubsidy: async (subsidyData) => {
    const response = await fetchWithAuth('/government/subsidies', {
      method: 'POST',
      body: JSON.stringify(subsidyData)
    });
    return response.json();
  },
  
  updateSubsidy: async (id, subsidyData) => {
    const response = await fetchWithAuth(`/government/subsidies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subsidyData)
    });
    return response.json();
  },
  
  getAllSubsidies: async () => {
    const response = await fetchWithAuth('/subsidies/admin/all');
    return response.json();
  }
};

// Message API calls
export const messageAPI = {
  sendMessage: async (messageData) => {
    const response = await fetchWithAuth('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
    return response.json();
  },
  
  getMessages: async (channelType) => {
    const url = channelType ? `/messages?channelType=${channelType}` : '/messages';
    const response = await fetchWithAuth(url);
    return response.json();
  },
  
  getThreadMessages: async (threadId) => {
    const response = await fetchWithAuth(`/messages/thread/${threadId}`);
    return response.json();
  },
  
  getUnreadCount: async (channelType) => {
    const url = channelType ? `/messages/unread-count?channelType=${channelType}` : '/messages/unread-count';
    const response = await fetchWithAuth(url);
    return response.json();
  },
  
  getMessagingUsers: async () => {
    const response = await fetchWithAuth('/messages/users');
    return response.json();
  }
};

// Subsidy API calls
export const subsidyAPI = {
  applyForSubsidy: async (subsidyData) => {
    const response = await fetchWithAuth('/subsidies', {
      method: 'POST',
      body: JSON.stringify(subsidyData)
    });
    return response.json();
  },
  
  getSubsidies: async () => {
    const response = await fetchWithAuth('/subsidies');
    return response.json();
  },
  
  getSubsidy: async (id) => {
    const response = await fetchWithAuth(`/subsidies/${id}`);
    return response.json();
  },
  
  updateSubsidy: async (id, subsidyData) => {
    const response = await fetchWithAuth(`/subsidies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subsidyData)
    });
    return response.json();
  },
  
  deleteSubsidy: async (id) => {
    const response = await fetchWithAuth(`/subsidies/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Equipment API calls
export const equipmentAPI = {
  addEquipment: async (equipmentData) => {
    const response = await fetchWithAuth('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipmentData)
    });
    return response.json();
  },
  
  getEquipment: async () => {
    const response = await fetchWithAuth('/equipment');
    return response.json();
  },
  
  getEquipmentItem: async (id) => {
    const response = await fetchWithAuth(`/equipment/${id}`);
    return response.json();
  },
  
  updateEquipment: async (id, equipmentData) => {
    const response = await fetchWithAuth(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipmentData)
    });
    return response.json();
  },
  
  deleteEquipment: async (id) => {
    const response = await fetchWithAuth(`/equipment/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  addMaintenanceRecord: async (id, maintenanceData) => {
    const response = await fetchWithAuth(`/equipment/${id}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(maintenanceData)
    });
    return response.json();
  },
  
  updateUsageHours: async (id, hoursData) => {
    const response = await fetchWithAuth(`/equipment/${id}/usage`, {
      method: 'PUT',
      body: JSON.stringify(hoursData)
    });
    return response.json();
  }
};

// Error handling utility
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  return error.message || 'An unexpected error occurred';
};

export default {
  authAPI,
  landAPI,
  governmentAPI,
  subsidyAPI,
  equipmentAPI,
  handleAPIError
};