'use client'
import s from './error.module.scss'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('Error')
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className={s.error}>
      <h1>{t('somethingWrong')}</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        {t('tryAgain')}
      </button>
    </div>
  )
}