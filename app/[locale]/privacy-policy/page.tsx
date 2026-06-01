import s from './page.module.scss';
import { AboutDocument, PrivacyPolicyDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode, Markdown } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/app/[locale]/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import { Image } from 'react-datocms';
import { getTranslations } from 'next-intl/server';
import Article from '@/components/layout/Article';
import Content from '@/components/content/Content';

export default async function PrivacyPolicy({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { privacyPolicy, draftUrl } = await apiQuery(PrivacyPolicyDocument);

	if (!privacyPolicy) return notFound();

	return (
		<>
			<Article>
				<section className={s.privacy}>
					<Markdown content={privacyPolicy.text} />
				</section>
			</Article>
			<DraftMode url={draftUrl} path={getPathname({ locale, href: '/privacy-policy' })} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const t = await getTranslations('Common');
	return await buildMetadata({
		title: t('privacyPolicy'),
		pathname: '/privacy-policy',
		locale: 'en' as SiteLocale,
	});
}
