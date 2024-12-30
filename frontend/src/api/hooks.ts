import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, del, put, post } from '@/api/client';
import { type DynamicData } from '@/types';

const API_URL = import.meta.env.VITE_API_ENDPOINT;
const QUERY_KEY = ['items'];

export function useListItems() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => get<DynamicData[]>(`${API_URL}/crud`),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => del(`${API_URL}/crud/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    retry: 1
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DynamicData> }) => 
      put(`${API_URL}/crud/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    retry: 1
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<DynamicData, 'id'>) => 
      post(`${API_URL}/crud`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    retry: 1
  });
}
