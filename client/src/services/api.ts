const API_BASE_URL = '/api';

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
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `${API_BASE_URL}/books${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      return response.json();
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
    
    create: async (token: string, bookData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: bookData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create book');
      }
      
      return response.json();
    },
    
    update: async (token: string, id: string, bookData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: bookData,
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
    getLogs: async (token: string, params?: {
      page?: number;
      limit?: number;
      bookId?: string;
      action?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `${API_BASE_URL}/stock/logs${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock logs');
      }
      
      return response.json();
    },
    
    getSummary: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/stock/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock summary');
      }
      
      return response.json();
    },
  },

  // Borrow endpoints
  borrow: {
    getAll: async (token: string, params?: {
      page?: number;
      limit?: number;
      userId?: string;
      bookId?: string;
      status?: string;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `${API_BASE_URL}/borrow${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch borrow records');
      }
      
      return response.json();
    },
    
    create: async (token: string, borrowData: {
      bookId: string;
      userId: string;
      dueDate?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(borrowData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create borrow record');
      }
      
      return response.json();
    },
    
    returnBook: async (token: string, id: string) => {
      const response = await fetch(`${API_BASE_URL}/borrow/return/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to return book');
      }
      
      return response.json();
    },
    
    getOverdue: async (token: string, params?: {
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `${API_BASE_URL}/borrow/overdue${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch overdue books');
      }
      
      return response.json();
    },
  },

  // Users endpoints
  users: {
    getAll: async (token: string, params?: {
      page?: number;
      limit?: number;
      role?: string;
      search?: string;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const url = `${API_BASE_URL}/users${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      return response.json();
    },
    
    getById: async (token: string, id: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      return response.json();
    },
    
    create: async (token: string, userData: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }
      
      return response.json();
    },
    
    update: async (token: string, id: string, userData: {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }
      
      return response.json();
    },
    
    delete: async (token: string, id: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      return response.json();
    },
  },
};
