import s from './page.module.scss';
import { PartnerDocument } from '@/graphql';
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

export default async function Partners({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { partner, draftUrl } = await apiQuery<PartnerQuery, PartnerQueryVariables>(PartnerDocument, {
		variables: {
			locale,
		},
	});

	if (!partner) return notFound();
	const { title, examples } = partner;

	return (
		<>
			<Article title={title}>
				<ul className={s.examples}>
					{examples.map(({ id, logo, text }) => (
						<li key={id}>
							<img className={s.logo} src={logo.url} alt={logo.alt} />
							<Content content={text} />
						</li>
					))}
				</ul>
			</Article>
			<DraftMode url={draftUrl} path={`/partners`} />
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
