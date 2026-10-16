'use client';
import type { ReactNode } from 'react';
import Loader from '@/components/Loader';
import { IoArrowBack } from 'react-icons/io5';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Buttons/Button';
import ButtonRay from '@/components/Buttons/ButtonRay';
import InputImage from '@/components/Inputs/InputImage';
import { EVENT_IMAGE_RECOMMENDATION } from '@/utils/imageCrop';
import InputField from '@/components/Inputs/InputField';
import InputSelect from '@/components/Inputs/InputSelect';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import InputMultiSelect from '@/components/Inputs/InputMultiSelect';
import adminStyles from '@/app/(pages)/(private)/AdminPage.module.css';
import { useEventForm } from '@/hooks/pages/(private)/Events/id/useEventForm';
import styles from '@/app/(pages)/(private)/Events/[id]/EventForm.module.css';
import { MdEventNote, MdInfoOutline, MdGroups, MdPlace, MdSchedule, MdDescription, MdImage, MdKey } from 'react-icons/md';

const FieldShell = ({ label, children, className }: { label: string; children: ReactNode; className?: string; }): React.ReactElement => {
  return (
    <div className={`${styles.fieldWrapper} ${className ?? ''}`.trim()}>
      <div className={styles.fieldBox}>
        {children}
        <span className={styles.fieldLabel}>
          {Array.from(label).map((char, index) => (
            <span
              key={`${label}-${index}`}
              className={styles.labelChar}
              style={{ '--index': index } as React.CSSProperties}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

const Section = ({ icon, title, description, children, className }: { icon: ReactNode; title: string; description?: string; children: ReactNode; className?: string }): React.ReactElement => (
  <section className={`${styles.section} ${className ?? ''}`.trim()}>
    <header className={styles.sectionHeader}>
      <span className={styles.sectionIcon} aria-hidden>{icon}</span>
      <div>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </div>
    </header>
    {children}
  </section>
);

export default function EventForm(): React.ReactElement {
  const { initialUrl, loading, isNew, categories, courses, semesterOptions, courseValues, categoryValue, semesterValue, locationValue, locations, availableDates, startOptions, endOptions, startTime, endTime, isOnline, isMultiDay, isCustomTime, isOtherLocation, today, loadedDate, loadedEndDate, nameRef, descRef, speakerRef, maxRef, customLocRef, startDateRef, endDateRef, durationRef, restrictedRef, presenceSecretRef, presenceSecret, setSelectedFile, handleCategoryChange, handleLocationChange, handleDateChange, handleEndDateChange, handleMultiDayChange, handleCustomTimeChange, handleStartTimeChange, setStartTime, setEndTime, handleSubmit, handleCourseChangeUI, handleSemesterChangeUI } = useEventForm();

  return (
    <main className={adminStyles.page}>
      {loading && <Loader />}

      <Button href="/Events" variant="ghost" size="sm" icon={<IoArrowBack />} className={styles.back}>Voltar para eventos</Button>

      <PageHeader
        icon={<MdEventNote />}
        eyebrow="Eventos"
        title={isNew ? 'Novo evento' : 'Editar evento'}
        description={isNew
          ? 'Preencha os dados abaixo. Datas e horários já ocupados no local escolhido não aparecem nas opções.'
          : 'Altere o que precisar e salve. As inscrições já feitas continuam valendo.'}
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <Section icon={<MdInfoOutline />} title="Informações principais">
              <div className={styles.row}>
                <InputField ref={nameRef} label="Nome do Evento" />

                <div className={styles.customWrapper}>
                  <div className={styles.flexField}>
                    <InputSelect
                      label="Categoria"
                      value={categoryValue}
                      onChange={handleCategoryChange}
                      options={[
                        { label: 'Não especificar', value: '' },
                        ...categories
                          .filter(({ name }) => name)
                          .map(({ id, name }) => ({
                            label: name as string,
                            value: String(id),
                          })),
                      ]}
                    />
                  </div>

                  {isOnline && <InputField ref={durationRef} label="Duração (min)" type="number" />}
                </div>
              </div>

              <div className={styles.row}>
                <InputField ref={speakerRef} label="Palestrante/Responsável" />
                <InputField ref={maxRef} label="Limite de Inscrições" type="number" />
              </div>
            </Section>

            <Section icon={<MdImage />} title="Imagem de capa" description="Usada nos cards da agenda e no topo da página do evento.">
              <div className={styles.upload}>
                <InputImage
                  id="event-image"
                  recommendedSize={EVENT_IMAGE_RECOMMENDATION}
                  initialUrl={initialUrl ?? undefined}
                  onChange={(file) => setSelectedFile(file)}
                  className={styles.previewImage}
                />
              </div>
            </Section>

            <Section icon={<MdGroups />} title="Público" description="Escolher cursos torna o evento exclusivo para alunos desses cursos.">
              <div className={styles.row}>
                <InputMultiSelect
                  label="Cursos"
                  value={courseValues}
                  onChange={handleCourseChangeUI}
                  options={courses
                    .filter(({ name }) => name)
                    .map(({ id, name }) => ({
                      label: name as string,
                      value: String(id),
                    }))}
                />

                <InputSelect
                  label="Semestre"
                  value={semesterValue}
                  disabled={!courseValues.length}
                  onChange={handleSemesterChangeUI}
                  options={[
                    { label: 'Não especificar', value: '' },
                    ...semesterOptions.map((value) => ({
                      label:
                        value === 'ALL'
                          ? 'Todos'
                          : value === 'ESPECIAL'
                            ? 'Especial'
                            : `${value.replace('SEMESTER', '')}º`,
                      value,
                    })),
                  ]}
                />
              </div>

              <div className={styles.checkboxRow}>
                <InputCheckbox
                  ref={restrictedRef}
                  label="Evento restrito a alunos e colaboradores"
                  disabled={courseValues.length > 0}
                  title={courseValues.length > 0 ? 'Eventos vinculados a cursos são automaticamente restritos' : ''}
                />
              </div>
            </Section>

            <Section icon={<MdPlace />} title="Local e data">
              <div className={styles.row}>
                <div className={styles.customWrapper}>
                  <div className={styles.flexField}>
                    <InputSelect
                      label="Localização"
                      value={locationValue}
                      onChange={handleLocationChange}
                      hideOptionValue='Selecione uma localização'
                      options={[
                        ...locations
                          .filter((location) => location.name)
                          .map((location) => ({
                            label: location.name as string,
                            value: String(location.id),
                          })),
                      ]}
                    />
                  </div>

                  {isOtherLocation && (
                    <div className={styles.flexField}>
                      <InputField label="Qual o local" ref={customLocRef} />
                    </div>
                  )}
                </div>

                <FieldShell label="Data do Evento">
                  <input
                    ref={startDateRef}
                    type="date"
                    className={styles.nativeField}
                    defaultValue={loadedDate || ''}
                    min={isNew ? today : undefined}
                    disabled={isNew && !availableDates.length && !isOnline && !isOtherLocation && !isCustomTime}
                    onChange={handleDateChange}
                    required
                  />
                </FieldShell>
              </div>

              <div className={styles.row}>
                <div className={styles.checkboxRow}>
                  <InputCheckbox
                    checked={isMultiDay}
                    label="Evento ocorre em mais de um dia"
                    onChange={(event) => handleMultiDayChange(event.target.checked)}
                  />
                </div>

                {isMultiDay ? (
                  <FieldShell label="Data final do Evento">
                    <input
                      ref={endDateRef}
                      type="date"
                      className={styles.nativeField}
                      defaultValue={loadedEndDate || ''}
                      min={startDateRef.current?.value || loadedDate || today}
                      onChange={handleEndDateChange}
                      required
                    />
                  </FieldShell>
                ) : (
                  <div />
                )}
              </div>
            </Section>

            <Section icon={<MdSchedule />} title="Horário">
              <div className={styles.checkboxRow}>
                <InputCheckbox
                  checked={isCustomTime}
                  label="Horário personalizado (fora dos horários de aula)"
                  onChange={(event) => handleCustomTimeChange(event.target.checked)}
                />
              </div>

              {isCustomTime && (
                <p className={styles.hint}>
                  Informe qualquer horário, inclusive fora do horário de aula. Se o evento terminar depois da meia-noite, marque &quot;Evento ocorre em mais de um dia&quot;.
                </p>
              )}

              {isCustomTime ? (
                <div className={styles.row}>
                  <FieldShell label="Horário de Início">
                    <input
                      type="time"
                      className={styles.nativeField}
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      required
                    />
                  </FieldShell>

                  <FieldShell label="Horário de Fim">
                    <input
                      type="time"
                      className={styles.nativeField}
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      required
                    />
                  </FieldShell>
                </div>
              ) : (
                <div className={styles.row}>
                  <InputSelect
                    label="Horário de Início"
                    value={startTime}
                    disabled={!startOptions.length}
                    onChange={(value) => {
                      setStartTime(value);
                      handleStartTimeChange(value);
                      setEndTime('');
                    }}
                    options={[
                      { label: 'Horário de início', value: '' },
                      ...startOptions.map((slot) => ({
                        label: slot,
                        value: slot,
                      })),
                    ]}
                  />

                  <InputSelect
                    label="Horário de Fim"
                    value={endTime}
                    disabled={!startTime}
                    onChange={setEndTime}
                    options={[
                      { label: 'Horário de fim', value: '' },
                      ...endOptions.map((slot) => ({
                        label: slot,
                        value: slot,
                      })),
                    ]}
                  />
                </div>
              )}
            </Section>

            <Section icon={<MdDescription />} title="Descrição" description="Conte o que o público vai encontrar. Aparece na página do evento e no e-mail de confirmação.">
              <FieldShell label="Descrição do Evento" className={styles.textareaWrapper}>
                <textarea
                  ref={descRef}
                  className={styles.nativeTextarea}
                  placeholder=""
                  required
                />
              </FieldShell>
            </Section>
          </div>

          <aside className={styles.sideColumn}>
            <Section icon={<MdKey />} title="Presença" description="Os participantes digitam esta palavra para confirmar a presença no evento.">
              <InputField
                ref={presenceSecretRef}
                label="Palavra secreta de presença"
                required={false}
              />

              {!isNew && !presenceSecret && (
                <p className={styles.hint}>
                  Este evento ainda não possui uma palavra secreta cadastrada. Informe uma palavra para permitir a validação de presença.
                </p>
              )}
            </Section>

            <div className={styles.submitCard}>
              <ButtonRay text={isNew ? 'Criar evento' : 'Salvar edições'} type="submit" />
              <Button href="/Events" variant="ghost" fullWidth>Cancelar</Button>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
