import { useRef } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { useEditUser } from "@/hooks/api/Users/Patch/useEditUser";
import { useCreateUser } from "@/hooks/api/Users/Post/useCreateUser";
import { useGetAllUsers } from "@/hooks/api/Users/Get/useGetAllUsers";
import { useDeleteUser } from "@/hooks/api/Users/Delete/useDeleteUser";

export function useUsersPage() {
    const editUser = useEditUser();
    const createUser = useCreateUser();
    const deleteUser = useDeleteUser();
    const openModal = useModalStore((s) => s.openModal);
    const { users, loading, refetch } = useGetAllUsers();

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const newNameRef = useRef<HTMLInputElement>(null);
    const newEmailRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);

    return { editUser, createUser, deleteUser, openModal, users, loading, refetch, nameRef, emailRef, newNameRef, newEmailRef, newPasswordRef };
}