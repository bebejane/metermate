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
import Article from '@/components/layout/Article';
import Content from '@/components/common/Content';

export default async function Products({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { about, draftUrl } = await apiQuery<AboutQuery, AboutQueryVariables>(AboutDocument, {
		variables: {
			locale,
		},
	});

	if (!about) return notFound();
	console.log(about);
	return (
		<>
			<Article>
				<section className={s.about}>
					<div className={s.wrap}>
						<h1>{about.title}</h1>
						<Content content={about.text} />
					</div>
					<figure>
						<Image data={about.image.responsiveImage} />
					</figure>
				</section>
			</Article>
			<DraftMode url={draftUrl} path={`/om`} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;

	return await buildMetadata({
		pathname: getPathname({ locale, href: '/produkter' }),
		locale,
	});
}
