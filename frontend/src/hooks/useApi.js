import { useAuth } from '@clerk/clerk-react';

export default function useApi() {
  const { getToken } = useAuth();

  async function fetchUsers() {
    const token = await getToken();
    const res = await fetch(`${import.meta.env.VITE_API_BASE ?? ''}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.json();
  }

  return { fetchUsers };
}