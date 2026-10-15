import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';

export const alt = 'Eventos Fatec Itu';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage(): Promise<ImageResponse> {
    const logo = await readFile(join(process.cwd(), 'public/assets/images/Logo_FatecItu_WithoutBackground.png'));
    const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F9F9F9',
                    borderTop: '24px solid #A33535',
                    borderBottom: '24px solid #A33535',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img tags */}
                <img src={logoSrc} width={345} height={218} alt="" />
                <div style={{ marginTop: 32, fontSize: 72, fontWeight: 700, color: '#121212' }}>Eventos Fatec Itu</div>
                <div style={{ marginTop: 16, fontSize: 32, color: '#A33535', textAlign: 'center', maxWidth: 960 }}>
                    Palestras, workshops e encontros acadêmicos com inscrição on-line
                </div>
            </div>
        ),
        size,
    );
}
