import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { type DynamicData } from '@/types';

const QUERY_KEY = ['items'];

export function useListItems() {
  return useQuery<DynamicData[], Error>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<DynamicData[]>('/crud'); // Use relative path
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }
      return response.data;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/crud/${id}`); // Use relative path
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    retry: 1
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DynamicData> }) => {
      const response = await apiClient.put<DynamicData>(`/crud/${id}`, data); // Use relative path
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    retry: 1
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<DynamicData, 'id'>) => {
      const response = await apiClient.post<DynamicData>('/crud', data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onMutate: async (newItem) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousItems = queryClient.getQueryData(QUERY_KEY);
      queryClient.setQueryData(QUERY_KEY, (old: DynamicData[] = []) => [...old, newItem]);
      return { previousItems };
    },
    onError: (err, _newItem, context: any) => {
      console.error('Create mutation error:', err);
      queryClient.setQueryData(QUERY_KEY, context.previousItems);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }
  });
}
