import s from './page.module.scss';
import Article from '@/components/layout/Article';
import { getSession } from '@/lib/auth';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function AllCourses() {
	try {
		await getSession();
	} catch (e) {
		return redirect('/logga-in');
	}

	return <Article title='Medlem'>Medlem</Article>;
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const t = await getTranslations('menu');
	const title = t('member');
	return {
		title,
	} as Metadata;
}
