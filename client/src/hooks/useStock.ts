import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface StockItem {
  _id: string;
  name: string;
  type: 'book' | 'supply';
  category: string;
  quantity: number;
  minStock: number;
  lastUpdated: string;
}

export const useStock = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  stockLevel?: string;
}) => {
  const token = localStorage.getItem('token');
  
  return useQuery({
    queryKey: ['stock', params],
    queryFn: async () => {
      console.log('🔍 Fetching stock items with params:', params);
      console.log('🎫 Token:', token ? 'present' : 'missing');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.stock.getAll(token || '', params);
        console.log('📦 Stock API response:', result);
        return result;
      } catch (error) {
        console.error('❌ Stock API error:', error);
        throw error;
      }
    },
    enabled: !!token,
  });
};

export const useCreateStockItem = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      console.log('➕ Creating stock item...');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.stock.create(token || '', formData);
        console.log('✅ Stock item created:', result);
        toast.success('Stock item added successfully');
        return result;
      } catch (error) {
        console.error('❌ Create stock error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to create stock item');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      console.log('🔄 Updating stock quantity...');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      try {
        const result = await api.stock.update(token || '', id, { quantity });
        console.log('✅ Stock updated:', result);
        toast.success('Stock quantity updated');
        return result;
      } catch (error) {
        console.error('❌ Update stock error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to update stock');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });
};
