import { create } from 'zustand';
import { getMe } from '@/hooks/api/Auth/Get/getMe';
import { UserRoleProps } from '@/@Types/UserRoleProps';

type UserStore = {
    user: UserRoleProps | null;
    setUser: (user: UserRoleProps | null) => void;
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
