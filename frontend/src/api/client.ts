import { fetchAuthSession } from 'aws-amplify/auth';

async function getAuthToken() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();  // Changed from accessToken to idToken
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}

export async function get<T>(url: string): Promise<T> {
  return fetchWithAuth(url);
}

export async function post<T>(url: string, data: any): Promise<T> {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function put<T>(url: string, data: any): Promise<T> {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function del(url: string): Promise<void> {
  return fetchWithAuth(url, {
    method: 'DELETE',
  });
}
