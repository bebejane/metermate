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
import { Link } from '@/i18n/routing';
import Shortcut from '@/components/blocks/Shortcut';
import NewsTicker from '@/components/common/NewsTicker';
import Hero from './Hero';
import Logos from '@/app/[locale]/Logos';
import Content from '@/components/common/Content';

export default async function Home({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { start, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument, {
		variables: {
			locale,
		},
	});

	const { allProducts } = await apiQuery<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, {
		variables: {
			locale,
		},
	});

	const individualProduct = allProducts.find(({ forIndividuals }) => forIndividuals);

	if (!start) return notFound();

	return (
		<>
			<Article>
				<Hero start={start} />
				<section className={s.appdownload}>
					<figure>
						<Image data={start.image.responsiveImage} className={s.image} />
					</figure>
					<h3>{start.textApp}</h3>
					<div className={s.download}>
						<a href={start.ios}>
							<img className={s.store} src='/images/icon-appstore.png' alt='App Store' />
						</a>
						<a href={start.android}>
							<img className={s.store} src='/images/icon-playstore.png' alt='Google Play' />
						</a>
					</div>
				</section>
				<Logos logos={start.logos} />
				<section className={s.products}>
					<div className={s.header}>
						<div>
							<h2>Våra realtidsmätere för el</h2>
						</div>
						<p></p>
						{individualProduct && (
							<Link
								className={s.private}
								key={individualProduct.id}
								href={{
									pathname: '/produkter/[category]/[productType]/[product]',
									params: {
										product: individualProduct.slug,
										category: individualProduct.category?.slug,
										productType: individualProduct.productType?.slug,
									},
								}}
							>
								<h3>Är du här som privatperson?</h3>
								<span className='small'>Läs mer om våra produkter här.</span>
							</Link>
						)}
					</div>
					<ul>
						{allProducts
							.filter(({ forIndividuals }) => !forIndividuals)
							.map(({ id, slug, category, productType, thumb, variant }) => (
								<Link
									key={id}
									href={{
										pathname: '/produkter/[category]/[productType]/[product]',
										params: {
											product: slug,
											category: category?.slug,
											productType: productType?.slug,
										},
									}}
								>
									<li>
										<figure>{thumb?.responsiveImage && <Image data={thumb.responsiveImage} />}</figure>
										<h4>{variant?.title}</h4>
									</li>
								</Link>
							))}
					</ul>
				</section>
				<section className={s.shortcuts}>
					{start.shortcut.map((shortcut) => (
						<Shortcut key={shortcut.id} shortcut={shortcut as ShortcutRecord} locale={locale} />
					))}
				</section>
				<section className={s.faq}>
					<Content content={start.faqText} className={s.faqText} />
				</section>
				<NewsTicker news={start.news} headline='Senaste nytt' />
			</Article>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const { start } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument, {
		variables: {
			locale,
		},
	});

	return await buildMetadata({
		title: { absolute: start.seo?.title ?? 'MeterMate' },
		description: start.seo?.description,
		pathname: getPathname({ locale, href: '/' }),
		locale,
	});
}
