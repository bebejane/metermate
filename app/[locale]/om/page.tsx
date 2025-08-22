import s from './page.module.scss';
import { StartDocument, AllProductsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import { Image } from 'react-datocms';
import Article from '@/components/layout/Article';

export default async function Products({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { allProducts, draftUrl } = await apiQuery<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, {
		variables: {
			locale,
		},
	});

	return (
		<>
			<Article></Article>
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
