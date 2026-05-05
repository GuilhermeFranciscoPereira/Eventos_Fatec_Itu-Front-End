import { useState } from "react";
import { useTwoFactor, useLogin } from "@/hooks/api/Auth/Post/useLogin";

export function useLoginPage() {
    const { submitCode, loading: loadingTwoFactor, error: twoFactorError } = useTwoFactor();
    const { emailRef, passwordRef, errors, stage, setStage, handleSubmit } = useLogin();

    const [visible, setVisible] = useState(false);
    const [remember, setRemember] = useState(false);
    const type = visible ? 'text' : 'password';

    return { submitCode, loadingTwoFactor, twoFactorError, emailRef, passwordRef, errors, stage, setStage, handleSubmit, setVisible, remember, setRemember, type };
}