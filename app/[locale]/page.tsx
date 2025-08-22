import s from './page.module.scss';
import { StartDocument, AllProductsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import { VideoPlayer } from 'next-dato-utils/components';
import { Image } from 'react-datocms';
import Article from '@/components/layout/Article';
import Link from 'next/link';
import Shortcut from '@/components/blocks/Shortcut';
import NewsTicker from '@/components/common/NewsTicker';

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
				<section className={s.hero}>
					<VideoPlayer data={start.film} className={s.video} />
					<header>
						<h1 className={s.title}>{start.filmText[0]?.text}</h1>
					</header>
				</section>
				<section className={s.appdownload}>
					<Image data={start.image.responsiveImage} className={s.image} />
					<h3>{start.textApp}</h3>
					<Link href={start.ios}>
						<img className={s.store} src='/images/icon-appstore.png' alt='App Store' />
					</Link>
					<Link href={start.android}>
						<img className={s.store} src='/images/icon-playstore.png' alt='Google Play' />
					</Link>
				</section>
				<section className={s.products}>
					<header>
						<h3>Våra produkter</h3>
						<div className={s.private}>
							<h3>Är du här som privatperson?</h3>
							<span>Läs mer om våra produkter här.</span>
						</div>
					</header>
					<ul>
						{allProducts.map((product) => (
							<Link href='/produkter' key={product.id}>
								<li>
									<Image data={product.image.responsiveImage} />
									<h4>{product.title}</h4>
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
				<NewsTicker news={start.news} headline='Senaste nyheter' />
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
		pathname: getPathname({ locale, href: '/' }),
		locale,
	});
}
