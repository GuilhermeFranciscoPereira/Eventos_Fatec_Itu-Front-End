export type ImageRecommendation = {
    width: number;
    height: number;
    // Fraction of the image width that stays visible on phones, where the box is narrower and the sides get cropped (cover).
    mobileVisibleRatio?: number;
};

export type PixelArea = { x: number; y: number; width: number; height: number };

export type ImageSize = { width: number; height: number };

// Sizes come from where each image is displayed: the event detail banner (800x300 on desktop, @2x) and the home carousel (4:1, full width).
// No mobileVisibleRatio: the event banner keeps 16:6 on phones too, so the whole crop shows on every screen.
export const EVENT_IMAGE_RECOMMENDATION: ImageRecommendation = { width: 1600, height: 600 };
// On phones the carousel is 3:1, so 3/4 of the 4:1 width stays visible.
export const CAROUSEL_IMAGE_RECOMMENDATION: ImageRecommendation = { width: 1920, height: 480, mobileVisibleRatio: 0.75 };

// Keeps uploads light: nothing on the site is displayed wider than this.
const MAX_OUTPUT_SIDE = 2560;

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

export function formatAspectRatio({ width, height }: ImageSize): string {
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
}

export function formatSize({ width, height }: ImageSize): string {
    return `${width} × ${height} px`;
}

export function meetsRecommendation(size: ImageSize, recommendation: ImageRecommendation): boolean {
    return size.width >= recommendation.width && size.height >= recommendation.height;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
        image.src = src;
    });
}

export function getOutputSize(area: ImageSize, recommendation: ImageRecommendation, lockedToRecommendation: boolean): ImageSize {
    if (lockedToRecommendation && area.width >= recommendation.width) {
        return { width: recommendation.width, height: recommendation.height };
    }
    const scale = Math.min(1, MAX_OUTPUT_SIDE / Math.max(area.width, area.height));
    return { width: Math.max(1, Math.round(area.width * scale)), height: Math.max(1, Math.round(area.height * scale)) };
}

// Halving step by step avoids the aliasing a single big downscale produces on canvas.
function drawDownscaled(image: HTMLImageElement, area: PixelArea, output: ImageSize): HTMLCanvasElement {
    let source: CanvasImageSource = image;
    let sx = area.x;
    let sy = area.y;
    let sw = area.width;
    let sh = area.height;

    while (sw / 2 > output.width && sh / 2 > output.height) {
        const step = document.createElement('canvas');
        step.width = Math.round(sw / 2);
        step.height = Math.round(sh / 2);
        const stepCtx = step.getContext('2d');
        if (!stepCtx) break;
        stepCtx.imageSmoothingQuality = 'high';
        stepCtx.drawImage(source, sx, sy, sw, sh, 0, 0, step.width, step.height);
        source = step;
        sx = 0;
        sy = 0;
        sw = step.width;
        sh = step.height;
    }

    const canvas = document.createElement('canvas');
    canvas.width = output.width;
    canvas.height = output.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Seu navegador não permite editar imagens.');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, sx, sy, sw, sh, 0, 0, output.width, output.height);
    return canvas;
}

export async function cropImageToFile(image: HTMLImageElement, area: PixelArea, output: ImageSize, sourceFile: File): Promise<File> {
    // PNG keeps transparency; everything else becomes JPEG, which Cloudinary re-encodes anyway (f_auto).
    const type = sourceFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const canvas = drawDownscaled(image, area, output);

    if (type === 'image/jpeg') {
        const flattened = document.createElement('canvas');
        flattened.width = canvas.width;
        flattened.height = canvas.height;
        const ctx = flattened.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, flattened.width, flattened.height);
            ctx.drawImage(canvas, 0, 0);
        }
        return toFile(ctx ? flattened : canvas, type, sourceFile.name);
    }

    return toFile(canvas, type, sourceFile.name);
}

async function toFile(canvas: HTMLCanvasElement, type: string, originalName: string): Promise<File> {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.92));
    if (!blob) throw new Error('Não foi possível gerar a imagem recortada.');
    const baseName = originalName.replace(/\.[^.]+$/, '') || 'imagem';
    const extension = type === 'image/png' ? 'png' : 'jpg';
    return new File([blob], `${baseName}-recorte.${extension}`, { type, lastModified: Date.now() });
}
