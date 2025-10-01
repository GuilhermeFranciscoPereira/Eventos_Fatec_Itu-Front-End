'use client';
import Loader from '@/components/Loader';
import ButtonRay from '@/components/Buttons/ButtonRay';
import InputImage from '@/components/Inputs/InputImage';
import InputDefault from '@/components/Inputs/InputDefault';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import ButtonComebackUrl from '@/components/Buttons/ButtonComebackUrl';
import { useEventForm } from '@/hooks/pages/(private)/Events/useEventForm';
import styles from '@/app/(pages)/(private)/Events/[id]/EventForm.module.css';

export default function EventForm(): React.ReactElement {
  const {
    initialUrl,
    loading,
    isNew,
    categories,
    courses,
    semesterOptions,
    courseValue,
    locationOptions,
    availableDates,
    startOptions,
    endOptions,
    startTime,
    endTime,
    isOnline,
    today,
    loadedDate,
    nameRef,
    descRef,
    speakerRef,
    maxRef,
    locationRef,
    customLocRef,
    courseRef,
    semesterRef,
    categoryRef,
    startDateRef,
    durationRef,
    restrictedRef,
    setSelectedFile,
    handleCategoryChange,
    handleLocationChange,
    handleDateChange,
    handleStartTimeChange,
    setStartTime,
    setEndTime,
    handleSubmit,
    handleCourseChangeUI,
    handleSemesterChangeUI,
  } = useEventForm();

  return (
    <main className={styles.formPage}>
      {loading && <Loader />}
      <ButtonComebackUrl />
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
          <InputDefault ref={nameRef} label="Nome do Evento" />
          <div className={styles.customWrapper}>
            <select ref={categoryRef} className={styles.input} defaultValue="" onChange={handleCategoryChange}>
              <option value="">Categoria (opcional)</option>
              {categories.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            {isOnline && <InputDefault ref={durationRef} label="Duração (min)" type="number" />}
          </div>
        </div>
        <div className={styles.row}>
          <select ref={courseRef} className={styles.input} defaultValue="" onChange={handleCourseChangeUI}>
            <option value="">Curso (Todos)</option>
            {courses.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <select
            ref={semesterRef}
            className={styles.input}
            defaultValue=""
            disabled={courseValue === ''}
            onChange={handleSemesterChangeUI}
          >
            <option value="">Semestre (opcional)</option>
            {semesterOptions.map(v => (
              <option key={v} value={v}>
                {v === 'ALL'
                  ? 'Todos'
                  : v === 'ESPECIAL'
                    ? 'Especial'
                    : `${v.replace('SEMESTER', '')}º`}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.row}>
          <InputDefault ref={maxRef} label="Limite de Inscrições" type="number" />
          <div className={styles.customWrapper}>
            <select ref={locationRef} className={styles.input} defaultValue="" onChange={handleLocationChange} required>
              <option value="">Localização</option>
              {locationOptions.map(v => (
                <option key={v} value={v}>
                  {v.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {locationRef.current?.value === 'OUTROS' && (
              <InputDefault label="Qual o local" ref={customLocRef} />
            )}
          </div>
        </div>
        <div className={styles.row}>
          <InputDefault ref={speakerRef} label="Palestrante/Responsável" />
          <input
            ref={startDateRef}
            type="date"
            className={styles.input}
            defaultValue={loadedDate || ''}
            min={isNew ? today : undefined}
            disabled={isNew && !availableDates.length && !isOnline}
            onChange={handleDateChange}
            required
          />
        </div>
        <div className={styles.row}>
          <select
            className={styles.input}
            value={startTime}
            disabled={!startOptions.length}
            required
            onChange={e => {
              setStartTime(e.target.value)
              handleStartTimeChange(e.target.value)
              setEndTime('')
            }}
          >
            <option value="" disabled>Horário de início</option>
            {startOptions.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <select
            className={styles.input}
            value={endTime}
            disabled={!startTime}
            required
            onChange={e => setEndTime(e.target.value)}
          >
            <option value="" disabled>Horário de fim</option>
            {endOptions.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.row}>
          <div className={styles.checkboxInput}>
            <InputCheckbox ref={restrictedRef} label="Evento Restrito?" />
          </div>
        </div>
        <textarea
          ref={descRef}
          className={styles.textarea}
          placeholder="Descrição do evento"
          required
        />
        <div className={styles.buttonSubmit}>
          <ButtonRay text={isNew ? 'Criar evento' : 'Salvar edições'} type="submit" />
        </div>
      </form>
    </main>
  )
}
