import s from './page.module.scss';
import { ProductDocument, AllProductsDocument } from '@/graphql';
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
import Content from '@/components/common/Content';

export default async function Products({ params }: PageProps) {
	const { locale, product: slug, category } = await params;
	setRequestLocale(locale);

	const { product, draftUrl } = await apiQuery<ProductQuery, ProductQueryVariables>(ProductDocument, {
		variables: {
			slug,
			locale,
		},
	});

	if (!product) return notFound();

	return (
		<>
			<Article className={s.product}>
				<section className={s.intro}>
					<div className={s.introText}>
						<div className={s.wrapper}>
							<h1>{product.title}</h1>
							<Content content={product.intro} />
						</div>
					</div>
					<figure>
						<Image data={product.image.responsiveImage} />
					</figure>
				</section>
				{product.layout.map((data, idx) => (
					<Block key={idx} data={data} />
				))}
			</Article>
			<DraftMode url={draftUrl} path={`/produkter/${category}/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allProducts } = await apiQuery<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, {
		all: true,
		tags: ['product'],
	});
	return allProducts.map(({ slug: product, category, productType }) => ({
		product,
		category: category.slug,
		productType: productType?.slug,
	}));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale, product: slug, category } = await params;
	setRequestLocale(locale);

	const { product } = await apiQuery<ProductQuery, ProductQueryVariables>(ProductDocument, {
		variables: {
			slug,
			locale,
		},
	});

	return await buildMetadata({
		title: product?.seo?.title,
		description: product?.seo?.description,
		pathname: getPathname({
			locale,
			href: {
				pathname: '/produkter/[category]/[productType]/[product]',
				params: {
					product: slug,
					category: category?.slug,
					productType: product.productType?.slug,
				},
			},
		}),
		locale,
	});
}
