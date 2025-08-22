import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Article from '@/components/layout/Article';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import { VideoPlayer } from 'next-dato-utils/components';
import AppDownload from '@/components/start/AppDownload';

export default async function Home({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { start, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument, {
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
					<img src='/images/app-download.png' alt='App Download' />
					<h3>Ladda ner vår app för att installera din MeterMate här</h3>
					<img src='/images/icon-appstore.png' alt='App Store' />
					<img src='/images/icon-playstore.png' alt='Google Play' />
				</section>
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
