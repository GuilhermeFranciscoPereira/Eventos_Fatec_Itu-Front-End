'use client';
import Image from 'next/image';
import Loader from '@/components/Loader';
import { FiCamera } from 'react-icons/fi';
import { IoMdImages } from 'react-icons/io';
import { MdArrowBack } from 'react-icons/md';
import ButtonRay from '@/components/Buttons/ButtonRay';
import ImageCloudinary from '@/components/ImageCloudinary';
import InputDefault from '@/components/Inputs/InputDefault';
import InputCheckbox from '@/components/Inputs/InputCheckbox';
import { useEventForm } from '@/hooks/pages/(private)/Events/useEventForm';
import styles from '@/app/(pages)/(private)/Events/[id]/EventForm.module.css';

export default function EventForm(): React.ReactElement {
  const { fileRef, previewLocal, initialUrl, loading, isNew, categories, courseOptions, semesterOptions, locationOptions, availableDates, startOptions, endOptions, startTime, endTime, isOnline, today, loadedDate, nameRef, descRef, speakerRef, maxRef, locationRef, customLocRef, courseRef, semesterRef, categoryRef, startDateRef, durationRef, restrictedRef, handleFileChange, handleCategoryChange, handleLocationChange, handleDateChange, handleStartTimeChange, setStartTime, setEndTime, handleSubmit, goBack } = useEventForm();

  return (
    <main className={styles.formPage}>
      {loading && <Loader />}
      <header className={styles.formHeader}>
        <MdArrowBack size={24} className={styles.backIcon} onClick={goBack} />
        <h1>{isNew ? 'Criar Evento' : 'Editar Evento'}</h1>
      </header>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.upload} onClick={() => fileRef.current?.click()}>
          {
            previewLocal
              ? (<Image src={previewLocal} alt="Preview local" width={1000} height={1000} className={styles.previewImage} quality={100} />)
              : initialUrl
                ? (
                  <div className={styles.uploadImage}>
                    <ImageCloudinary
                      src={initialUrl}
                      alt="Preview existente"
                      sizes="(max-width: 768px) 100vw, 900px"
                      priority
                    />
                  </div>
                )
                : (
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcons}>
                      <FiCamera size={32} />
                      <span>|</span>
                      <IoMdImages size={32} />
                    </div>
                    <p>Clique para selecionar uma imagem, cole ou arraste e solte aqui</p>
                  </div>
                )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFileChange}
            hidden
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
          <select ref={courseRef} className={styles.input} defaultValue="" required>
            <option value="">Curso</option>
            {courseOptions.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <select ref={semesterRef} className={styles.input} defaultValue="">
            <option value="">Semestre (opcional)</option>
            {semesterOptions.map(v => (
              <option key={v} value={v}>
                {v.replace('SEMESTER', '')}º
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
              <InputDefault label='Qual o local' ref={customLocRef} />
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
          <select className={styles.input} value={startTime} disabled={!startOptions.length} required
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
            <InputCheckbox
              ref={restrictedRef}
              label="Evento Restrito?"
            />
          </div>
        </div>
        <textarea
          ref={descRef}
          className={styles.textarea}
          placeholder="Descrição do evento"
          required
        />
        <div className={styles.buttonSubmit}>
          <ButtonRay text={isNew ? 'Criar evento' : 'Salvar edições'} type='submit' />
        </div>
      </form>
    </main>
  )
}
