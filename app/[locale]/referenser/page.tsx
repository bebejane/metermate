import s from './page.module.scss';
import { ReferenceDocument } from '@/graphql';
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

	const { reference, draftUrl } = await apiQuery<ReferenceQuery, ReferenceQueryVariables>(ReferenceDocument, {
		variables: {
			locale,
		},
	});

	if (!reference) return notFound();
	const { title, intro, examples } = reference;
	return (
		<>
			<Article title={title} intro={intro}>
				{examples.map(({ id, image, link, logo, text, title }) => (
					<section key={id} className={s.example}>
						<div className={s.wrap}>
							<img className={s.logo} src={logo.url} alt={logo.alt} />
							<h3>{title}</h3>
							<Content content={text} />
							<a href={link}>Läs mer</a>
						</div>
						<figure>
							<Image data={image.responsiveImage} />
						</figure>
					</section>
				))}
			</Article>
			<DraftMode url={draftUrl} path={`/`} />
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
