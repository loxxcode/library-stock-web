import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  ISBN: string;
  quantity: number;
  availableQuantity: number;
  coverImage: {
    url: string;
    public_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const useBooks = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
}) => {
  const token = localStorage.getItem('token');
  
  return useQuery({
    queryKey: ['books', params],
    queryFn: async () => {
      console.log('🔍 Fetching books with params:', params);
      console.log('🎫 Token:', token ? 'present' : 'missing');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.books.getAll(token || '', params);
        console.log('📚 Books API response:', result);
        return result;
      } catch (error) {
        console.error('❌ Books API error:', error);
        throw error;
      }
    },
    enabled: !!token,
  });
};

export const useBook = (id: string) => {
  const token = localStorage.getItem('token');
  
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => api.books.getById(token || '', id),
    enabled: !!token && !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: (bookData: FormData) => {
      console.log('🚀 Creating book with data:', bookData);
      console.log('🎫 Token:', token ? 'present' : 'missing');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      return api.books.create(token, bookData);
    },
    onSuccess: (data) => {
      console.log('✅ Book created successfully:', data);
      toast.success('Book created successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      console.error('❌ Book creation failed:', error);
      toast.error(error.message || 'Failed to create book');
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: ({ id, bookData }: { id: string; bookData: FormData }) => {
      if (!token) {
        throw new Error('No authentication token found');
      }
      return api.books.update(token, id, bookData);
    },
    onSuccess: (data) => {
      toast.success('Book updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', data.data._id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update book');
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: (id: string) => {
      if (!token) {
        throw new Error('No authentication token found');
      }
      return api.books.delete(token, id);
    },
    onSuccess: () => {
      toast.success('Book deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete book');
    },
  });
};

export const useAddStock = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => {
      if (!token) {
        throw new Error('No authentication token found');
      }
      return api.books.addStock(token, id, quantity);
    },
    onSuccess: (data) => {
      toast.success('Stock added successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', data.data._id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add stock');
    },
  });
};

export const useRemoveStock = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => {
      if (!token) {
        throw new Error('No authentication token found');
      }
      return api.books.removeStock(token, id, quantity);
    },
    onSuccess: (data) => {
      toast.success('Stock removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', data.data._id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove stock');
    },
  });
};
