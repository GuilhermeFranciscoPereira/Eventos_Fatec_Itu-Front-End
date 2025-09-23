'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Loader from '@/components/Loader';
import ButtonRay from '@/components/Buttons/ButtonRay';
import { useLogin } from '@/hooks/api/Auth/Post/useLogin';
import { useTwoFactor } from '@/hooks/api/Auth/Post/useLogin';
import CodeInputValidation from '@/components/CodeInputValidation';
import styles from '@/app/(pages)/(public)/Login/Login.module.css';
import { MdEmail, MdKey, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function Login(): React.ReactElement {
    const { emailRef, passwordRef, loading, errors, stage, handleSubmit } = useLogin();
    const { submitCode, loading: loadingTwoFactor, error: twoFactorError } = useTwoFactor();

    const [visible, setVisible] = useState(false);
    const [remember, setRemember] = useState(false);
    const type = visible ? 'text' : 'password';

    return (
        <main className={styles.main}>
            {(loading || loadingTwoFactor) && <Loader />}

            <section className={styles.imageSection}>
                <Image
                    alt="Imagem de um pinguim segurando um binóculo, na volta dele possui um totem de radar"
                    src="/assets/images/login/loginPage.png"
                    width={580}
                    height={420}
                    quality={100}
                    className={styles.illustration}
                />
            </section>

            <section className={styles.formSection}>
                <div className={styles.formDiv}>
                    <div>
                        <h1>{stage === 'confirm' ? 'Autenticação em dois fatores' : 'Bem-vindo(a) a'}</h1>
                        <h2><span>F</span>atec <span>I</span>tu</h2>
                        {stage === 'confirm' ? (
                            <p className={styles.description}>Digite o código enviado para concluir o seu login!</p>
                        ) : (
                            <p className={styles.description}>Login restrito somente à colaboradores</p>
                        )}
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
                                <label htmlFor="email">Email</label>
                                <div className={styles.control}>
                                    <span className={styles.iconLeft}><MdEmail /></span>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="exemplo@gmail.com"
                                        ref={emailRef as React.RefObject<HTMLInputElement>}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                                {errors?.email && <p className={styles.error}>{errors.email}</p>}
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Senha</label>
                                <div className={styles.control}>
                                    <span className={styles.iconLeft}><MdKey /></span>
                                    <input
                                        id="password"
                                        name="password"
                                        type={type}
                                        placeholder="********"
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
                                <Link href="/Login/ResetPassword" className={styles.forgot}>Esqueceu sua senha?</Link>
                            </div>

                            {errors?.email && <p className={styles.error}>{errors.email}</p>}

                            <ButtonRay text='Entrar' type='submit' />
                        </form>
                    )}

                    {stage === 'confirm' && (
                        <div className={styles.form}>
                            <CodeInputValidation
                                infoTitle="Digite o código de autenticação"
                                validateFn={async (code: string) => { await submitCode(code); }}
                            >
                                {twoFactorError && <p className={styles.error}>{twoFactorError}</p>}
                            </CodeInputValidation>
                            <div className={styles.rowAlt}>
                                <Link href="/Login" className={styles.backLogin}>Voltar para o login</Link>
                            </div>
                        </div>
                    )}

                    <div className={styles.logorumoradares}>
                        <Image
                            alt="Logo da faculdade Fatec Itu"
                            src="/assets/images/Logo_FatecItu_WithoutBackground.png"
                            priority
                            width={120}
                            height={60}
                            quality={100}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
