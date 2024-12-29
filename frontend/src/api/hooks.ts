import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, del, put, post } from './client';
import { type DynamicData } from '../types';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

export function useListItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => get<DynamicData[]>(`${API_URL}/crud`)
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => del(`${API_URL}/crud/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DynamicData> }) => 
      put(`${API_URL}/crud/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<DynamicData, 'id'>) => 
      post(`${API_URL}/crud`, { ...data, id: crypto.randomUUID() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });
}
