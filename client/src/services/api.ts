const getApiBaseUrl = () => {
  // Check for environment variable first
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    console.log('🔧 Using environment variable API URL:', envApiUrl);
    return envApiUrl;
  }
  
  // Fallback logic
  if (import.meta.env.DEV) {
    const devUrl = 'http://localhost:5000/api';
    console.log('🔧 Using development API URL:', devUrl);
    return devUrl;
  }
  
  // Production environment
  const frontendUrl = window.location.origin;
  if (frontendUrl === 'https://library-stock-web.vercel.app') {
    const prodUrl = 'https://library-stock-web.onrender.com/api';
    console.log('🔧 Using production API URL:', prodUrl);
    return prodUrl;
  }
  
  // Fallback for other production environments
  const fallbackUrl = 'https://library-stock-web.onrender.com/api';
  console.log('🔧 Using fallback API URL:', fallbackUrl);
  return fallbackUrl;
};

const API_BASE_URL = getApiBaseUrl();

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return response.json();
    },
    
    getMe: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }
      
      return response.json();
    },
  },

  // Books endpoints
  books: {
    getAll: async (token: string, params?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      author?: string;
    }) => {
      // Build query string only with defined values
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.author) queryParams.append('author', params.author);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/books${queryString ? `?${queryString}` : ''}`;
      
      console.log('🌐 API Call - Getting all books:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      console.log('  Params:', params);
      console.log('  Query String:', queryString);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to fetch books');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
    
    getById: async (token: string, id: string) => {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch book');
      }
      
      return response.json();
    },
    
    create: async (token: string, formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create book');
      }
      
      return response.json();
    },
    
    update: async (token: string, id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update book');
      }
      
      return response.json();
    },
    
    delete: async (token: string, id: string) => {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      
      return response.json();
    },
    
    addStock: async (token: string, id: string, quantity: number) => {
      const response = await fetch(`${API_BASE_URL}/books/${id}/add-stock`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add stock');
      }
      
      return response.json();
    },
    
    removeStock: async (token: string, id: string, quantity: number) => {
      const response = await fetch(`${API_BASE_URL}/books/${id}/remove-stock`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove stock');
      }
      
      return response.json();
    },
  },

  // Stock endpoints
  stock: {
    getAll: async (token: string, params?: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
      stockLevel?: string;
    }) => {
      // Build query string only with defined values
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.stockLevel) queryParams.append('stockLevel', params.stockLevel);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/stock${queryString ? `?${queryString}` : ''}`;
      
      console.log('🌐 API Call - Getting stock items:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      console.log('  Params:', params);
      console.log('  Query String:', queryString);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to fetch stock items');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
    
    create: async (token: string, formData: FormData) => {
      const url = `${API_BASE_URL}/stock`;
      
      console.log('🌐 API Call - Creating stock item:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to create stock item');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
    
    update: async (token: string, id: string, data: { quantity: number }) => {
      const url = `${API_BASE_URL}/stock/${id}`;
      
      console.log('🌐 API Call - Updating stock item:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      console.log('  Data:', data);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to update stock item');
      }
      
      const result = await response.json();
      console.log('🌐 API Success response:', result);
      return result;
    },
  },
      
  // Users endpoints
  users: {
    getAll: async (token: string, params?: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
    }) => {
      // Build query string only with defined values
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.role) queryParams.append('role', params.role);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/users${queryString ? `?${queryString}` : ''}`;
      
      console.log('🌐 API Call - Getting users:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      console.log('  Params:', params);
      console.log('  Query String:', queryString);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to fetch users');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
    
    create: async (token: string, userData: {
      name: string;
      email: string;
      password: string;
      role: 'admin' | 'staff' | 'student';
    }) => {
      const url = `${API_BASE_URL}/users`;
      
      console.log('🌐 API Call - Creating user:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      console.log('  User data:', userData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to create user');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
    
    delete: async (token: string, userId: string) => {
      const url = `${API_BASE_URL}/users/${userId}`;
      
      console.log('🌐 API Call - Deleting user:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to delete user');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
  },

  // Borrows endpoints
  borrows: {
    getAll: async (token: string, params?: {
      page?: number;
      limit?: number;
      userId?: string;
      bookId?: string;
      status?: string;
    }) => {
      // Build query string only with defined values
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.userId) queryParams.append('userId', params.userId);
      if (params?.bookId) queryParams.append('bookId', params.bookId);
      if (params?.status) queryParams.append('status', params.status);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/borrows${queryString ? `?${queryString}` : ''}`;
      
      console.log('🌐 API Call - Getting borrows:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      console.log('  Params:', params);
      console.log('  Query String:', queryString);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to fetch borrows');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
    
    create: async (token: string, borrowData: {
      userId: string;
      bookId: string;
      dueDate: string;
    }) => {
      const url = `${API_BASE_URL}/borrows`;
      
      console.log('🌐 API Call - Creating borrow:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      console.log('  Borrow data:', borrowData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(borrowData),
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to create borrow');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
    
    returnBook: async (token: string, borrowId: string) => {
      const url = `${API_BASE_URL}/borrows/return/${borrowId}`;
      
      console.log('🌐 API Call - Returning book:');
      console.log('  URL:', url);
      console.log('  Token:', token ? 'present' : 'missing');
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('🌐 API Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('🌐 API Error response:', error);
        throw new Error(error.message || 'Failed to return book');
      }
      
      const data = await response.json();
      console.log('🌐 API Success response:', data);
      return data;
    },
  },
};
