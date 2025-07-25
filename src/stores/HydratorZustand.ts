'use client';
import { useEffect } from 'react';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { useUserStore } from '@/stores/User/userStore';

export default function HydratorZustand(): null {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    void (async () => {
      const user = await getMe();
      setUser(user);
    })();
  }, [setUser]);

  return null;
}
