// Test the frontend API service
const { tasksAPI } = require('../frontend/src/services/api-fetch');

// Mock localStorage
global.localStorage = {
  getItem: function(key) {
    if (key === 'token') {
      return 'test-token';
    }
    return null;
  }
};

// Mock fetch
global.fetch = async function(url, options) {
  console.log('Fetch called with:', { url, options });
  
  // Mock response for tasks stats
  if (url.includes('/tasks/stats')) {
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          overall: {
            total: 5,
            completed: 3,
            pending: 2
          }
        }
      })
    };
  }
  
  // Default response
  return {
    ok: true,
    json: async () => ({ success: true, data: {} })
  };
};

async function testTasksAPI() {
  try {
    console.log('Testing tasksAPI.getStats()...');
    const response = await tasksAPI.getStats();
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

testTasksAPI();