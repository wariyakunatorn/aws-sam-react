import { get as amplifyGet, post as amplifyPost, put as amplifyPut, del as amplifyDel } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

interface ApiHeaders {
  [key: string]: string;
}

interface ApiResponse<T = any> {
  data: T;
  error?: string;
}

const getAuthHeader = async (): Promise<ApiHeaders> => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (!token) throw new Error('No token available');
    
    return {
      Authorization: `Bearer ${token}`
    };
  } catch (error) {
    console.error('Error getting auth session:', error);
    return {};
  }
};

export const apiClient = {
  get: async <T>(path: string): Promise<ApiResponse<T>> => {
    try {
      const headers = await getAuthHeader();
      const response = await amplifyGet({
        apiName: 'myApi',
        path: path.startsWith('/') ? path : `/${path}`, // Ensure path starts with /
        options: {
          headers
        }
      }).response;
      const data = await response.body.json();
      return { data: data as T };
    } catch (error: any) {
      return { data: {} as T, error: error.message };
    }
  },

  post: async <T>(path: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const headers = await getAuthHeader();
      console.log('POST request:', { path, data });
      
      const response = await amplifyPost({
        apiName: 'myApi',
        path: path.startsWith('/') ? path : `/${path}`,
        options: {
          headers,
          body: data
        }
      }).response;
      
      const responseStatus = response.statusCode || 500;
      if (responseStatus >= 400) {
        const errorData = await response.body.text();
        console.error('Server error:', errorData);
        throw new Error(errorData || `HTTP error! status: ${responseStatus}`);
      }
      
      const responseData = await response.body.json();
      console.log('POST response:', responseData);
      return { data: responseData as T };
    } catch (error: any) {
      console.error('POST request failed:', error);
      return { 
        data: {} as T, 
        error: error.message || 'Failed to create item' 
      };
    }
  },

  put: async <T>(path: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const headers = await getAuthHeader();
      const response = await amplifyPut({
        apiName: 'myApi',
        path: path.startsWith('/') ? path : `/${path}`, // Ensure path starts with /
        options: {
          headers,
          body: data
        }
      }).response;
      const responseData = await response.body.json();
      return { data: responseData as T };
    } catch (error: any) {
      return { data: {} as T, error: error.message };
    }
  },

  delete: async (path: string): Promise<ApiResponse<void>> => {
    try {
      const headers = await getAuthHeader();
      await amplifyDel({
        apiName: 'myApi',
        path: path.startsWith('/') ? path : `/${path}`, // Ensure path starts with /
        options: {
          headers
        }
      }).response;
      return { data: undefined };
    } catch (error: any) {
      return { data: undefined, error: error.message };
    }
  }
};

export type { ApiResponse };
