import s from './page.module.scss';
import { AllSupportsDocument, SupportStartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import Article from '@/components/layout/Article';
import Content from '@/components/common/Content';
import React from 'react';
import SupportMenu from '@/app/[locale]/support/SupportMenu';

export default async function Support({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { supportStart } = await apiQuery<SupportStartQuery, SupportStartQueryVariables>(SupportStartDocument, {
		variables: {
			locale,
		},
	});

	const { allSupports, draftUrl } = await apiQuery<AllSupportsQuery, AllSupportsQueryVariables>(AllSupportsDocument, {
		variables: {
			locale,
		},
	});

	return (
		<>
			<Article title={supportStart.title} intro={supportStart.intro}>
				<section className={s.support}>
					<SupportMenu allSupports={allSupports} />
					<div className={s.items}>
						{allSupports.map(({ id, slug, title, sections }) => (
							<React.Fragment key={id}>
								<h3 id={slug}>{title}</h3>
								<ul className={s.sections}>
									{sections.map((item) => (
										<li id={`${slug}-${item.slug}`} key={item.id}>
											<h5>{item.title}</h5>
											<Content content={item.text} />
										</li>
									))}
								</ul>
							</React.Fragment>
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
	const t = await getTranslations('menu');
	const title = t('support');

	return await buildMetadata({
		title,
		pathname: getPathname({ locale, href: '/support' }),
		locale,
	});
}
