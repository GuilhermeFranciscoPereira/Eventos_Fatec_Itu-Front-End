'use client';
import Link from 'next/link';
import Loader from '@/components/Loader';
import AuthShell from '@/components/AuthShell';
import ButtonRay from '@/components/Buttons/ButtonRay';
import CodeInputValidation from '@/components/CodeInputValidation';
import styles from '@/app/(pages)/(public)/Login/Login.module.css';
import { useLoginPage } from '@/hooks/pages/(public)/Login/useLoginPage';
import { MdEmail, MdKey, MdVisibility, MdVisibilityOff, MdArrowBack } from 'react-icons/md';

export default function Login(): React.ReactElement {
    const { submitCode, loadingTwoFactor, twoFactorError, emailRef, passwordRef, errors, stage, setStage, handleSubmit, setVisible, remember, setRemember, type } = useLoginPage();

    return (
        <AuthShell illustration="/assets/images/login/loginPage.png" illustrationAlt="Ilustração de alunos sentados em frente à faculdade Fatec Itu">
            {loadingTwoFactor && <Loader />}

            <div className={styles.intro}>
                <span className={styles.step}>{stage === 'confirm' ? 'Etapa 2 de 2' : 'Etapa 1 de 2'}</span>
                <h1 className={styles.title}>{stage === 'confirm' ? 'Verificação em duas etapas' : 'Bem-vindo(a) de volta'}</h1>
                <p className={styles.description}>
                    {stage === 'confirm'
                        ? 'Enviamos um código de 6 dígitos para o seu e-mail. Digite-o abaixo para concluir o login.'
                        : 'Acesso restrito aos colaboradores da Fatec Itu.'}
                </p>
            </div>

            {stage !== 'confirm' && (
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                    }}
                    method="post"
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">E-mail</label>
                        <div className={styles.control}>
                            <span className={styles.iconLeft}><MdEmail aria-hidden /></span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nome@fatec.sp.gov.br"
                                ref={emailRef as React.RefObject<HTMLInputElement>}
                                autoComplete="email"
                                required
                                autoFocus
                            />
                        </div>
                        {errors?.email && <p className={styles.error}>{errors.email}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Senha</label>
                        <div className={styles.control}>
                            <span className={styles.iconLeft}><MdKey aria-hidden /></span>
                            <input
                                id="password"
                                name="password"
                                type={type}
                                placeholder="••••••••"
                                ref={passwordRef as React.RefObject<HTMLInputElement>}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                aria-label={type === 'password' ? 'Mostrar senha' : 'Ocultar senha'}
                                onClick={() => setVisible((v) => !v)}
                                className={styles.iconRight}
                            >
                                {type === 'password' ? <MdVisibility size={18} /> : <MdVisibilityOff size={18} />}
                            </button>
                        </div>
                        {errors?.password && <p className={styles.error}>{errors.password}</p>}
                    </div>

                    <div className={styles.row}>
                        <label className={styles.remember}>
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Lembrar-me
                        </label>
                        <Link href="/Login/ResetPassword" className={styles.link}>Esqueceu sua senha?</Link>
                    </div>

                    <ButtonRay text='Entrar' type='submit' />
                </form>
            )}

            {stage === 'confirm' && (
                <div className={styles.form}>
                    <CodeInputValidation
                        infoTitle="Código de verificação"
                        validateFn={async (code: string) => { await submitCode(code); }}
                    >
                        {twoFactorError && <p className={styles.error}>{twoFactorError}</p>}
                    </CodeInputValidation>

                    <div className={styles.rowCenter} onClick={() => setStage('request')}>
                        <Link href="/Login" className={styles.link}><MdArrowBack aria-hidden /> Voltar para o login</Link>
                    </div>
                </div>
            )}
        </AuthShell>
    );
}
