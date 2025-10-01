import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdArrowBack } from 'react-icons/md'
import styles from '@/components/Buttons/ButtonComebackUrl/ButtonComebackUrl.module.css'

type ButtonComebackUrlProps = {
    url?: string
    label?: string
}

export default function ButtonComebackUrl({ url, label = 'Voltar' }: ButtonComebackUrlProps): React.ReactElement {
    const router = useRouter()

    if (url) {
        return (
            <Link href={url} className={styles.comebackWrapper}>
                <span className={styles.icon}>
                    <MdArrowBack size={20} />
                </span>
                <span className={styles.label}>{label}</span>
            </Link>
        )
    }

    return (
        <button type="button" onClick={() => router.back()} className={styles.comebackWrapper}>
            <span className={styles.icon}>
                <MdArrowBack size={20} />
            </span>
            <span className={styles.label}>{label}</span>
        </button>
    )
}
