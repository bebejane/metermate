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
						<h2>Våra produkter</h2>
						<div className={s.private}>
							<h3>Är du här som privatperson?</h3>
							<span className='small'>Läs mer om våra produkter här.</span>
						</div>
					</div>
					<ul>
						{allProducts.map(({ id, slug, category, productType, image, title }) => (
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
									{image?.responsiveImage && <Image data={image.responsiveImage} />}
									<h4>{title}</h4>
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
		title: { absolute: 'MeterMate' },
		pathname: getPathname({ locale, href: '/' }),
		locale,
	});
}
