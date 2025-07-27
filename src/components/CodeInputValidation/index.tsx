import Loader from '@/components/Loader';
import styles from '@/components/CodeInputValidation/CodeInputValidation.module.css';
import useCodeInputValidation from '@/hooks/components/CodeInputValidation/useCodeInputValidation';

type CodeInputValidationProps = {
    infoTitle: string;
    children?: React.ReactNode;
    validateFn: (code: string) => Promise<void>;
};

export default function CodeInputValidation({ infoTitle, children, validateFn }: CodeInputValidationProps): React.ReactElement {
    const { inputRefs, handleInput, handleKey, clearAll, handleSubmit, loading, error, isComplete } = useCodeInputValidation(validateFn);

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
                <div className={styles.info}>
                    <span className={styles.title}>{infoTitle}</span>
                    <p className={styles.description}>Digite o código enviado para o seu e-mail!</p>
                </div>

                {children}

                <div className={styles.inputFields}>
                    {inputRefs.map((ref, idx) => (
                        <input
                            key={idx}
                            ref={ref}
                            type="tel"
                            inputMode="numeric"
                            maxLength={1}
                            autoFocus={idx === 0}
                            onKeyDown={e => {
                                if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) e.preventDefault();
                                handleKey(idx, e.key, e.currentTarget.value);
                            }}
                            onChange={e => {
                                const v = e.currentTarget.value.replace(/\D/g, '');
                                e.currentTarget.value = v;
                                handleInput(idx, v);
                            }}
                            aria-label={`Dígito ${idx + 1}`}
                        />
                    ))}
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.actionBtns}>
                    <button type="button" onClick={clearAll} className={styles.clear}>Limpar</button>
                    <button type="submit" className={styles.verify} disabled={!isComplete}>
                        {loading ? <Loader /> : 'Verificar o código'}
                    </button>
                </div>
            </form>
        </div>
    );
}
