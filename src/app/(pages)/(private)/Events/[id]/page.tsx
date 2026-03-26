'use client';
import type { ReactNode } from 'react';
import Loader from '@/components/Loader';
import ButtonRay from '@/components/Buttons/ButtonRay';
import InputImage from '@/components/Inputs/InputImage';
import InputField from '@/components/Inputs/InputField';
import InputSelect from '@/components/Inputs/InputSelect';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import { useEventForm } from '@/hooks/pages/(private)/Events/useEventForm';
import styles from '@/app/(pages)/(private)/Events/[id]/EventForm.module.css';

type FieldShellProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

function FieldShell({ label, children, className }: FieldShellProps): React.ReactElement {
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
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

export default function EventForm(): React.ReactElement {
  const { initialUrl, loading, isNew, categories, courses, semesterOptions, courseValue, categoryValue, semesterValue, locationValue, locations, availableDates, startOptions, endOptions, startTime, endTime, isOnline, isOtherLocation, today, loadedDate, nameRef, descRef, speakerRef, maxRef, customLocRef, startDateRef, durationRef, restrictedRef, setSelectedFile, handleCategoryChange, handleLocationChange, handleDateChange, handleStartTimeChange, setStartTime, setEndTime, handleSubmit, handleCourseChangeUI, handleSemesterChangeUI } = useEventForm();

  return (
    <main className={styles.formPage}>
      {loading && <Loader />}

      <header className={styles.formHeader}>
        <h1>{isNew ? 'Criar Evento' : 'Editar Evento'}</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.upload}>
          <InputImage
            id="event-image"
            initialUrl={initialUrl ?? undefined}
            onChange={(file) => setSelectedFile(file)}
            className={styles.previewImage}
          />
        </div>

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
          <InputSelect
            label="Curso"
            value={courseValue}
            onChange={handleCourseChangeUI}
            options={[
              { label: 'Todos', value: '' },
              ...courses
                .filter(({ name }) => name)
                .map(({ id, name }) => ({
                  label: name as string,
                  value: String(id),
                })),
            ]}
          />

          <InputSelect
            label="Semestre"
            value={semesterValue}
            disabled={courseValue === ''}
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

        <div className={styles.row}>
          <InputField ref={maxRef} label="Limite de Inscrições" type="number" />

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
        </div>

        <div className={styles.row}>
          <InputField ref={speakerRef} label="Palestrante/Responsável" />

          <FieldShell label="Data do Evento">
            <input
              ref={startDateRef}
              type="date"
              className={styles.nativeField}
              defaultValue={loadedDate || ''}
              min={isNew ? today : undefined}
              disabled={isNew && !availableDates.length && !isOnline && !isOtherLocation}
              onChange={handleDateChange}
              required
            />
          </FieldShell>
        </div>

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

        <div className={`${styles.row} ${styles.checkboxRow}`}>
          <div className={styles.checkboxInput}>
            <InputCheckbox
              ref={restrictedRef}
              label="Evento Restrito?"
              disabled={courseValue !== ''}
              title={courseValue !== '' ? 'Eventos vinculados a um curso são automaticamente restritos' : ''}
            />
          </div>
        </div>

        <FieldShell label="Descrição do Evento" className={styles.textareaWrapper}>
          <textarea
            ref={descRef}
            className={styles.nativeTextarea}
            placeholder=""
            required
          />
        </FieldShell>

        <div className={styles.buttonSubmit}>
          <ButtonRay text={isNew ? 'Criar evento' : 'Salvar edições'} type="submit" />
        </div>
      </form>
    </main>
  );
}