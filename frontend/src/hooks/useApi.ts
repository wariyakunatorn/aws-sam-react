import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, del, put } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

interface DynamicData {
  id: string;
  [key: string]: any;
}

export const useApi = () => {
  const queryClient = useQueryClient();

  const fetchItems = async () => {
    const session = await fetchAuthSession();
    const response = await get({
      apiName: 'myApi',
      path: '/crud',
      options: {
        headers: {
          'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
        }
      }
    }).response;
    return response.body.json();
  };

  const createItem = async (data: DynamicData) => {
    const session = await fetchAuthSession();
    const response = await post({
      apiName: 'myApi',
      path: '/crud',
      options: {
        headers: {
          'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
        },
        body: data
      }
    }).response;
    return response.body.json();
  };

  const updateItem = async ({ id, data }: { id: string; data: DynamicData }) => {
    const session = await fetchAuthSession();
    const response = await put({
      apiName: 'myApi',
      path: `/crud/${id}`,
      options: {
        headers: {
          'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
        },
        body: data
      }
    }).response;
    return response.body.json();
  };

  const deleteItem = async (id: string) => {
    const session = await fetchAuthSession();
    await del({
      apiName: 'myApi',
      path: `/crud/${id}`,
      options: {
        headers: {
          'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
        }
      }
    });
    return id;
  };

  return {
    useItems: () => useQuery({
      queryKey: ['items'],
      queryFn: fetchItems
    }),
    useCreateItem: () => useMutation({
      mutationFn: createItem,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] })
    }),
    useUpdateItem: () => useMutation({
      mutationFn: updateItem,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] })
    }),
    useDeleteItem: () => useMutation({
      mutationFn: deleteItem,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] })
    })
  };
};
