import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface Borrow {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  book: {
    _id: string;
    title: string;
    author: string;
    ISBN: string;
  };
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  createdAt: string;
}

export const useBorrows = (params?: {
  page?: number;
  limit?: number;
  userId?: string;
  bookId?: string;
  status?: string;
}) => {
  const token = localStorage.getItem('token');
  
  return useQuery({
    queryKey: ['borrows', params],
    queryFn: async () => {
      console.log('🔍 Fetching borrows with params:', params);
      console.log('🎫 Token:', token ? 'present' : 'missing');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.borrows.getAll(token || '', params);
        console.log('📚 Borrows API response:', result);
        return result;
      } catch (error) {
        console.error('❌ Borrows API error:', error);
        throw error;
      }
    },
    enabled: !!token,
  });
};

export const useCreateBorrow = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: async (borrowData: {
      userId: string;
      bookId: string;
      dueDate: string;
    }) => {
      console.log('➕ Creating borrow...');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.borrows.create(token || '', borrowData);
        console.log('✅ Borrow created:', result);
        toast.success('Book borrowed successfully');
        return result;
      } catch (error) {
        console.error('❌ Create borrow error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to borrow book');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrows'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: async (borrowId: string) => {
      console.log('🔄 Returning book...');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.borrows.returnBook(token || '', borrowId);
        console.log('✅ Book returned:', result);
        toast.success('Book returned successfully');
        return result;
      } catch (error) {
        console.error('❌ Return book error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to return book');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrows'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
