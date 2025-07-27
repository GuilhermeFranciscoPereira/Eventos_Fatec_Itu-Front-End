'use client';
import Image from 'next/image';
import Loader from '@/components/Loader';
import ButtonRay from '@/components/Buttons/ButtonRay';
import InputDefault from '@/components/Inputs/InputDefault';
import CodeInputValidation from '@/components/CodeInputValidation';
import styles from '@/app/(pages)/(public)/Login/Login.module.css';
import { usePasswordResetConfirm, usePasswordResetRequest } from '@/hooks/api/Auth/Post/useResetPassword';

export default function ResetPassword(): React.ReactElement {
    const { emailRef, handleRequest, loading: loadingRequest, error, stage } = usePasswordResetRequest();
    const { newPasswordRef, confirmPasswordRef, handleConfirm, loading: loadingConfirm } = usePasswordResetConfirm();

    return stage === 'request' ? (
        <main className={styles.resetPasswordRequest}>
            <Image className={styles.imgIllustration} height={200} width={200} quality={100} src="/assets/images/login/reset-password-illustration.png" alt="Ilustração para redefinição de senha" />
            <form onSubmit={handleRequest}>
                <h1 style={{ textAlign: 'center', marginTop: 20 }}>Esqueci minha senha</h1>
                <InputDefault
                    ref={emailRef}
                    label="E-mail"
                    type="email"
                />
                {error && (<p style={{ margin: '0 0 20px 10px', color: 'red' }}>{error}</p>)}
                <br />
                {loadingRequest ? (<Loader />) : (<ButtonRay text="Solicitar código" type="submit" />)}
            </form>
        </main>
    ) : (
        <section className={styles.resetPasswordConfirm}>
            <Image className={styles.imgIllustration} height={200} width={200} quality={100} src="/assets/images/login/reset-password-illustration.png" alt="Ilustração para redefinição de senha" />

            <CodeInputValidation
                infoTitle="Redefinir senha"
                validateFn={handleConfirm}
            >
                {loadingConfirm && <Loader />}
                <InputDefault
                    ref={newPasswordRef}
                    label="Nova senha"
                    type="password"
                    style={{ margin: '10px 0 25px' }}
                />
                <InputDefault
                    ref={confirmPasswordRef}
                    label="Confirme nova senha"
                    type="password"
                    style={{ margin: '0 0 10px' }}
                />
            </CodeInputValidation>
        </section>
    );
}
