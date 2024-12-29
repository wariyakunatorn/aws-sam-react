import { signOut as amplifySignOut } from 'aws-amplify/auth';

export async function signOut() {
  try {
    await amplifySignOut();
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}
