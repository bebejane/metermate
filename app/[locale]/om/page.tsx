import s from './page.module.scss';
import { AboutDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import { Image } from 'react-datocms';
import { getTranslations } from 'next-intl/server';
import Article from '@/components/layout/Article';
import Content from '@/components/common/Content';

export default async function Products({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { about, draftUrl } = await apiQuery(AboutDocument, {
		variables: {
			locale,
		},
	});

	if (!about) return notFound();

	return (
		<>
			<Article>
				<section className={s.about}>
					<div className={s.wrap}>
						<h1>{about.title}</h1>
						<Content content={about.text} />
					</div>
					<figure>
						<Image data={about.image.responsiveImage} placeholderClassName={s.placeholder} />
					</figure>
				</section>
			</Article>
			<DraftMode url={draftUrl} path={`/om`} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations('menu');
	const { about } = await apiQuery(AboutDocument, {
		variables: {
			locale,
		},
	});

	return await buildMetadata({
		title: about.seo?.title ?? t('om'),
		description: about.seo?.description,
		pathname: getPathname({ locale, href: '/om' }),
		locale,
	});
}
