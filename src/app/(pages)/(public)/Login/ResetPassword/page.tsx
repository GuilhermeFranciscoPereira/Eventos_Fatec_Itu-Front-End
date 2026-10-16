'use client';
import Link from 'next/link';
import Loader from '@/components/Loader';
import AuthShell from '@/components/AuthShell';
import ButtonRay from '@/components/Buttons/ButtonRay';
import styles from '@/app/(pages)/(public)/Login/Login.module.css';
import CodeInputValidation from '@/components/CodeInputValidation';
import { MdEmail, MdKey, MdVisibility, MdVisibilityOff, MdArrowBack } from 'react-icons/md';
import { useResetPasswordPage } from '@/hooks/pages/(public)/Login/useResetPasswordPage';

export default function ResetPassword(): React.ReactElement {
    const { emailRef, handleRequest, loadingRequest, error, info, stage, newPasswordRef, confirmPasswordRef, handleConfirm, loadingConfirm, visible1, setVisible1, visible2, setVisible2 } = useResetPasswordPage();

    return (
        <AuthShell illustration="/assets/images/login/resetPage.png" illustrationAlt="Ilustração de alunos sentados em frente à faculdade Fatec Itu">
            {(loadingRequest || loadingConfirm) && <Loader />}

            <div className={styles.intro}>
                <span className={styles.step}>{stage === 'request' ? 'Etapa 1 de 2' : 'Etapa 2 de 2'}</span>
                <h1 className={styles.title}>Recuperação de acesso</h1>
                <p className={styles.description}>
                    {stage === 'request'
                        ? 'Informe o seu e-mail para receber o código de redefinição.'
                        : 'Crie a nova senha e confirme com o código recebido.'}
                </p>
            </div>

            {stage === 'confirm' && info && <p className={styles.info} role="status">{info}</p>}

            {stage === 'request' && (
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRequest(e);
                    }}
                    method="post"
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="resetEmail">E-mail</label>
                        <div className={styles.control}>
                            <span className={styles.iconLeft}><MdEmail aria-hidden /></span>
                            <input
                                id="resetEmail"
                                name="email"
                                type="email"
                                placeholder="nome@fatec.sp.gov.br"
                                ref={emailRef as React.RefObject<HTMLInputElement>}
                                autoComplete="email"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <ButtonRay text='Enviar código' type='submit' />

                    <div className={styles.rowCenter}>
                        <Link href="/Login" className={styles.link}><MdArrowBack aria-hidden /> Voltar para o login</Link>
                    </div>
                </form>
            )}

            {stage === 'confirm' && (
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="newpassword">Nova senha</label>
                        <div className={styles.control}>
                            <span className={styles.iconLeft}><MdKey aria-hidden /></span>
                            <input
                                id="newpassword"
                                name="newpassword"
                                type={visible1 ? 'text' : 'password'}
                                placeholder="••••••••"
                                ref={newPasswordRef as React.RefObject<HTMLInputElement>}
                                autoComplete="new-password"
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                aria-label={visible1 ? 'Ocultar senha' : 'Mostrar senha'}
                                onClick={() => setVisible1((v) => v ? false : true)}
                                className={styles.iconRight}
                            >
                                {visible1 ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmpassword">Confirmar nova senha</label>
                        <div className={styles.control}>
                            <span className={styles.iconLeft}><MdKey aria-hidden /></span>
                            <input
                                id="confirmpassword"
                                name="confirmpassword"
                                type={visible2 ? 'text' : 'password'}
                                placeholder="••••••••"
                                ref={confirmPasswordRef as React.RefObject<HTMLInputElement>}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                aria-label={visible2 ? 'Ocultar senha' : 'Mostrar senha'}
                                onClick={() => setVisible2((v) => v ? false : true)}
                                className={styles.iconRight}
                            >
                                {visible2 ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                            </button>
                        </div>
                    </div>

                    <CodeInputValidation
                        infoTitle="Código enviado por e-mail"
                        validateFn={handleConfirm}
                    >
                        {loadingConfirm && <Loader />}
                    </CodeInputValidation>

                    <div className={styles.rowCenter}>
                        <Link href="/Login" className={styles.link}><MdArrowBack aria-hidden /> Voltar para o login</Link>
                    </div>
                </div>
            )}
        </AuthShell>
    );
}
