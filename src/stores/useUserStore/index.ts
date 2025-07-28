import { create } from 'zustand';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { UserJwtProps } from '@/@Types/UserJwtProps';

type UserStore = {
    user: UserJwtProps | null;
    setUser: (user: UserJwtProps | null) => void;
};

export const useUserStore = create<UserStore>((set) => {
    if (typeof window !== 'undefined') {
        void (async () => {
            const user = await getMe();
            set({ user });
        })();
    }

    return {
        user: null,
        setUser: (user) => set({ user }),
    }
});
