import { useState } from "react";
import { usePasswordResetRequest, usePasswordResetConfirm } from "@/hooks/api/Auth/Post/useResetPassword";

export function useResetPasswordPage() {
    const { emailRef, handleRequest, loading: loadingRequest, error, stage } = usePasswordResetRequest();
    const { newPasswordRef, confirmPasswordRef, handleConfirm, loading: loadingConfirm } = usePasswordResetConfirm();

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);

    return { emailRef, handleRequest, loadingRequest, error, stage, newPasswordRef, confirmPasswordRef, handleConfirm, loadingConfirm, visible1, setVisible1, visible2, setVisible2 };
}