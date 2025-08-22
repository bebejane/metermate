import s from './page.module.scss';
import { AllSupportsDocument } from '@/graphql';
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

export default async function Support({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { allSupports, draftUrl } = await apiQuery<AllSupportsQuery, AllSupportsQueryVariables>(AllSupportsDocument, {
		variables: {
			locale,
		},
	});

	return (
		<>
			<Article title={'Support'}>
				<section className={s.support}>
					<ul className={s.menu}>
						{allSupports.map(({ id, title, sections, slug }) => (
							<li key={id}>
								<a id={slug} key={id} href={`#${slug}`}>
									{title}
								</a>
								<ul>
									{sections.map(({ id, title, slug }) => (
										<li id={slug} key={id}>
											<a href={`#${slug}`}>{title}</a>
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
					<div className={s.items}>
						{allSupports.map(({ id, title, sections }) => (
							<>
								<h3>{title}</h3>
								<ul key={id} className={s.sections}>
									{sections.map(({ id, text, title }) => (
										<li key={id}>
											<h5>{title}</h5>
											<Content content={text} />
										</li>
									))}
								</ul>
							</>
						))}
					</div>
				</section>
			</Article>
			<DraftMode url={draftUrl} path={`/support`} />
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
