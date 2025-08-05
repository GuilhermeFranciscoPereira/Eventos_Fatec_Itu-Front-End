'use client';
import Link from 'next/link';
import ButtonRay from '../Buttons/ButtonRay';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { EventPublicResponse } from '@/@Types/EventTypes';
import styles from '@/components/CardEvents/CardEvents.module.css';
import { useGetAllEventsPublic } from '@/hooks/api/Events/Get/useGetAllEvents';

const cld = new Cloudinary({ cloud: { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME! } });

function Preview({ src, alt, height, width }: { src: string, alt: string, height: number, width: number }): React.ReactElement {
    const publicId: string = src.split('/').slice(-2).join('/').split('.')[0];
    const img = cld.image(publicId).resize(fill().width(width).height(height)).format('auto').quality('auto:best');
    return <AdvancedImage cldImg={img} alt={alt} />;
}

export default function CardEvents(): React.ReactElement {
    const { datas } = useGetAllEventsPublic();

    return (
        <section className={styles.cardEventsSection}>
            {datas.map((event: EventPublicResponse) => {
                return (
                    <article key={event.id} className={styles.card}>
                        <div className={styles.cardInt}>
                            {event.isRestricted && <span className={styles.badge}>Fatecano</span>}
                            <div className={styles.previewWrapper}>
                                <Preview src={event.imageUrl} alt={event.name} width={300} height={175} />
                            </div>
                            <div className={styles.cardData}>
                                <p className={styles.title}>{event.name}</p>
                                <p>Data: {new Date(event.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                <p>Horário: {[event.startTime, event.endTime].map(t => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })).join(' - ')
                                }</p>
                                <p>Local: {event.customLocation ?? event.location}</p>
                                <p>Palestrante: {event.speakerName}</p>
                                <Link href={`/EventDetail/${event.id}`}>
                                    <ButtonRay text="Ver mais sobre" type="button" />
                                </Link>
                            </div>
                        </div>
                    </article>
                );
            })}
        </section>
    );
}
