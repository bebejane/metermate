import s from './page.module.scss';
import Article from '@/components/layout/Article';
import { Link } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/routing';

export default async function MemberPage({ params }: PageProps) {
	const { locale } = await params;

	try {
		await getSession();
	} catch (e) {
		return redirect({ href: '/logga-in', locale });
	}

	return (
		<Article title='Medlem'>
			Medlem
			<p>
				<Link href='/logga-ut' locale={locale}>
					Logga ut
				</Link>
			</p>
		</Article>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const t = await getTranslations('menu');
	const title = t('member');
	return {
		title,
	} as Metadata;
}
