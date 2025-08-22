import s from './page.module.scss';
import { StartDocument, AllProductsDocument, ProductDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import { Image } from 'react-datocms';
import { Block } from '@/components/blocks';
import Article from '@/components/layout/Article';

export default async function Products({ params }: PageProps) {
	const { locale, product: slug } = await params;
	setRequestLocale(locale);

	const { product, draftUrl } = await apiQuery<ProductQuery, ProductQueryVariables>(ProductDocument, {
		variables: {
			locale,
		},
	});

	if (!product) return notFound();

	return (
		<>
			<Article>
				{product.layout.map((data, idx) => (
					<Block key={idx} data={data} />
				))}
			</Article>
			<DraftMode url={draftUrl} path={`/produkter/${slug}`} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale, product: slug } = await params;
	setRequestLocale(locale);

	const { product, draftUrl } = await apiQuery<ProductQuery, ProductQueryVariables>(ProductDocument, {
		variables: {
			locale,
		},
	});

	return await buildMetadata({
		title: product?.title,
		pathname: getPathname({ locale, href: '/produkter' }),
		locale,
	});
}
