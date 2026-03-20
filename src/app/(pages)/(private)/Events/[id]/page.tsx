'use client';
import type { ReactNode } from 'react';
import Loader from '@/components/Loader';
import ButtonRay from '@/components/Buttons/ButtonRay';
import InputImage from '@/components/Inputs/InputImage';
import InputField from '@/components/Inputs/InputField';
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
  const { initialUrl, loading, isNew, categories, courses, semesterOptions, courseValue, locations, availableDates, startOptions, endOptions, startTime, endTime, isOnline, today, loadedDate, nameRef, descRef, speakerRef, maxRef, locationRef, customLocRef, courseRef, semesterRef, categoryRef, startDateRef, durationRef, restrictedRef, setSelectedFile, handleCategoryChange, handleLocationChange, handleDateChange, handleStartTimeChange, setStartTime, setEndTime, handleSubmit, handleCourseChangeUI, handleSemesterChangeUI } = useEventForm();

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
            <FieldShell label="Categoria" className={styles.flexField}>
              <select
                ref={categoryRef}
                className={styles.nativeField}
                defaultValue=""
                onChange={handleCategoryChange}
              >
                <option value="">Categoria (opcional)</option>
                {categories.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </FieldShell>

            {isOnline && <InputField ref={durationRef} label="Duração (min)" type="number" />}
          </div>
        </div>

        <div className={styles.row}>
          <FieldShell label="Curso">
            <select
              ref={courseRef}
              className={styles.nativeField}
              defaultValue=""
              onChange={handleCourseChangeUI}
            >
              <option value="">Curso (Todos)</option>
              {courses.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Semestre">
            <select
              ref={semesterRef}
              className={styles.nativeField}
              defaultValue=""
              disabled={courseValue === ''}
              onChange={handleSemesterChangeUI}
            >
              <option value="">Semestre (opcional)</option>
              {semesterOptions.map((value) => (
                <option key={value} value={value}>
                  {value === 'ALL'
                    ? 'Todos'
                    : value === 'ESPECIAL'
                      ? 'Especial'
                      : `${value.replace('SEMESTER', '')}º`}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        <div className={styles.row}>
          <InputField ref={maxRef} label="Limite de Inscrições" type="number" />

          <div className={styles.customWrapper}>
            <FieldShell label="Localização" className={styles.flexField}>
              <select
                ref={locationRef}
                className={styles.nativeField}
                defaultValue=""
                onChange={handleLocationChange}
                required
              >
                <option value="" disabled hidden>
                  Selecione uma localização
                </option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </FieldShell>

            {locations.find(location => String(location.id) === locationRef.current?.value)?.name.toLowerCase() === 'outros' && (
              <InputField label="Qual o local" ref={customLocRef} />
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
              disabled={isNew && !availableDates.length && !isOnline}
              onChange={handleDateChange}
              required
            />
          </FieldShell>
        </div>

        <div className={styles.row}>
          <FieldShell label="Horário de Início">
            <select
              className={styles.nativeField}
              value={startTime}
              disabled={!startOptions.length}
              required
              onChange={(e) => {
                setStartTime(e.target.value);
                handleStartTimeChange(e.target.value);
                setEndTime('');
              }}
            >
              <option value="" disabled>
                Horário de início
              </option>
              {startOptions.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Horário de Fim">
            <select
              className={styles.nativeField}
              value={endTime}
              disabled={!startTime}
              required
              onChange={(e) => setEndTime(e.target.value)}
            >
              <option value="" disabled>
                Horário de fim
              </option>
              {endOptions.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        <div className={`${styles.row} ${styles.checkboxRow}`}>
          <div className={styles.checkboxInput}>
            <InputCheckbox ref={restrictedRef} label="Evento Restrito?" />
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