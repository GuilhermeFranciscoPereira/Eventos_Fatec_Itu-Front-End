'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Loader from '@/components/Loader';
import ButtonRay from '@/components/Buttons/ButtonRay';
import styles from '@/app/(pages)/(public)/Login/Login.module.css';
import CodeInputValidation from '@/components/CodeInputValidation';
import { MdEmail, MdKey, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { usePasswordResetConfirm, usePasswordResetRequest } from '@/hooks/api/Auth/Post/useResetPassword';

export default function ResetPassword(): React.ReactElement {
    const { emailRef, handleRequest, loading: loadingRequest, error, stage } = usePasswordResetRequest();
    const { newPasswordRef, confirmPasswordRef, handleConfirm, loading: loadingConfirm } = usePasswordResetConfirm();

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);

    return (
        <main className={styles.main}>
            {(loadingRequest || loadingConfirm) && <Loader />}

            <section className={styles.imageSection}>
                <Image
                    alt="Imagem de um pinguim segurando um binóculo, na volta dele possui um totem de radar"
                    src="/assets/images/login/resetPage.png"
                    width={580}
                    height={420}
                    quality={100}
                    className={styles.illustration}
                />
            </section>

            <section className={styles.formSection}>
                <div className={styles.formDiv}>
                    <div>
                        <h1>Recuperação de acesso</h1>
                        <h2><span>F</span>atec <span>I</span>tu</h2>
                        {stage === 'request' ? (
                            <p className={styles.description}>Informe seu e-mail para receber o código de redefinição</p>
                        ) : (
                            <p className={styles.description}>Informe a nova senha e o código de redefinição</p>
                        )}
                    </div>

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
                                <label htmlFor="resetEmail">Email</label>
                                <div className={styles.control}>
                                    <span className={styles.iconLeft}><MdEmail /></span>
                                    <input
                                        id="resetEmail"
                                        name="email"
                                        type="email"
                                        placeholder="exemplo@gmail.com"
                                        ref={emailRef as React.RefObject<HTMLInputElement>}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className={styles.error}>{error}</p>}

                            <ButtonRay text='Enviar código' type='submit' />

                            <div className={styles.rowAlt}>
                                <Link href="/Login" className={styles.backLogin}>Voltar para o login</Link>
                            </div>
                        </form>
                    )}

                    {stage === 'confirm' && (
                        <div className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="newpassword">Nova senha</label>
                                <div className={styles.control}>
                                    <span className={styles.iconLeft}><MdKey /></span>
                                    <input
                                        id="newpassword"
                                        name="newpassword"
                                        type={visible1 ? 'text' : 'password'}
                                        placeholder="********"
                                        ref={newPasswordRef as React.RefObject<HTMLInputElement>}
                                        autoComplete="new-password"
                                        required
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
                                    <span className={styles.iconLeft}><MdKey /></span>
                                    <input
                                        id="confirmpassword"
                                        name="confirmpassword"
                                        type={visible2 ? 'text' : 'password'}
                                        placeholder="********"
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

                            <hr />

                            <CodeInputValidation
                                infoTitle="Digite o código enviado"
                                validateFn={handleConfirm}
                            >
                                {loadingConfirm && <Loader />}
                            </CodeInputValidation>

                            <br />
                            <hr />

                            <div className={styles.rowAlt}>
                                <Link href="/Login" className={styles.backLogin}>Voltar para o login</Link>
                            </div>

                            <hr />
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
