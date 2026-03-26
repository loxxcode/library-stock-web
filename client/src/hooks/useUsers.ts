import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  createdAt: string;
  updatedAt: string;
}

export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  const token = localStorage.getItem('token');
  
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      console.log('🔍 Fetching users with params:', params);
      console.log('🎫 Token:', token ? 'present' : 'missing');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.users.getAll(token || '', params);
        console.log('👥 Users API response:', result);
        return result;
      } catch (error) {
        console.error('❌ Users API error:', error);
        throw error;
      }
    },
    enabled: !!token,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
      role: 'admin' | 'staff' | 'student';
    }) => {
      console.log('➕ Creating user...');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.users.create(token || '', userData);
        console.log('✅ User created:', result);
        toast.success('User created successfully');
        return result;
      } catch (error) {
        console.error('❌ Create user error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to create user');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: async (userId: string) => {
      console.log('🗑️ Deleting user...');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.users.delete(token || '', userId);
        console.log('✅ User deleted:', result);
        toast.success('User deleted successfully');
        return result;
      } catch (error) {
        console.error('❌ Delete user error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete user');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
