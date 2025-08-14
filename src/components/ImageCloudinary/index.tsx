import Image, { ImageLoaderProps } from 'next/image';
type FetchFormat = 'auto' | 'avif' | 'webp' | 'jpg' | 'png';
type CropMode = 'fill' | 'fill_pad' | 'crop' | 'fit' | 'thumb' | 'scale';

type ImageCloudinaryProps = {
    src: string;
    alt: string;
    sizes?: string;
    className?: string;
    priority?: boolean;
    cropMode?: CropMode;
    gravity?: string;
    fetchFormat?: FetchFormat;
};

const CLOUD_NAME: string = process.env.NEXT_PUBLIC_CLOUDINARY_NAME as string;

function normalizePublicId(input: string): string {
    if (!input) return '';
    if (input.startsWith('http')) {
        const parts = input.split('/upload/');
        return parts[1] ?? '';
    }
    return input.replace(/^\/+/, '');
}

export default function ImageCloudinary(props: ImageCloudinaryProps): React.ReactElement {
    const { src, alt, sizes = '100vw', className, priority, cropMode = 'fill', gravity = 'auto', fetchFormat = 'auto' } = props;
    const publicId: string = normalizePublicId(src);
    const cldLoader = ({ width }: ImageLoaderProps): string => {
        const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
        const transform = `f_${fetchFormat},q_auto:best,c_${cropMode},g_${gravity},w_${width}`;
        return `${base}${transform}/${publicId}`;
    };

    return (
        <Image
            loader={cldLoader}
            src={publicId}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={className}
            quality={100}
        />
    );
}
