import { create } from 'zustand';
import { UserRoleProps } from '@/@Types/UserRoleProps';

type UserStore = {
    user: UserRoleProps | null;
    setUser: (user: UserRoleProps | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
