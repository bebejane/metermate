import s from './page.module.scss';
import Article from '@/components/layout/Article';
import LogoutForm from './LogoutForm';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export default async function Login() {
	return (
		<Article>
			<div className={s.form}>
				<LogoutForm />
			</div>
		</Article>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const t = await getTranslations('menu');
	const title = t('logout');
	return {
		title,
	} as Metadata;
}
