'use client';

import Link from 'next/link';
import s from './not-found.module.scss';
import { useTranslations } from 'next-intl';

export default function NotFound() {
	const t = useTranslations('NotFound');
	return (
		<div className={s.container}>
			<h2>{t('title')}</h2>
			<p>{t('description')}</p>
			<Link href='/'>{t('returnHome')}</Link>
		</div>
	);
}
