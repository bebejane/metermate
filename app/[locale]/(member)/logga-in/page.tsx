'use server';

import s from './page.module.scss';
import Article from '@/components/layout/Article';
import LoginForm from './LoginForm';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export default async function Login() {
	return (
		<Article>
			<div className={s.wrap}>
				<h1>Kundlogin</h1>
				<div className={s.form}>
					<LoginForm />
				</div>
			</div>
		</Article>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const t = await getTranslations('menu');
	const title = t('login');

	return {
		title,
	} as Metadata;
}
