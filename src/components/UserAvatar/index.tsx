import ImageCloudinary from '@/components/ImageCloudinary';
import styles from '@/components/UserAvatar/UserAvatar.module.css';

type UserAvatarProps = {
    name?: string | null;
    imageUrl?: string | null;
    size?: 'sm' | 'md' | 'lg';
};

function initialsOf(name?: string | null): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
}

export default function UserAvatar({ name, imageUrl, size = 'md' }: UserAvatarProps): React.ReactElement {
    return (
        <span className={`${styles.avatar} ${styles[size]}`} aria-hidden>
            {imageUrl ? (
                <ImageCloudinary src={imageUrl} alt="" sizes="96px" />
            ) : (
                <span className={styles.initials}>{initialsOf(name)}</span>
            )}
        </span>
    );
}
