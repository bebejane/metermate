import s from './page.module.scss';
import { AllClientSupportsDocument, ClientSupportStartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import Article from '@/components/layout/Article';
import Content from '@/components/common/Content';
import React from 'react';
import ClientSupportMenu from './ClientSupportMenu';

export default async function ClientSupport({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { clientSupportStart } = await apiQuery(ClientSupportStartDocument, {
		variables: {
			locale,
		},
	});

	const { allClientSupports, draftUrl } = await apiQuery(AllClientSupportsDocument, {
		variables: {
			locale,
		},
	});

	return (
		<>
			<Article title={clientSupportStart.title} intro={clientSupportStart.intro}>
				<section className={s.clientSupport}>
					<ClientSupportMenu allClientSupports={allClientSupports} />
					<div className={s.items}>
						{allClientSupports.map(({ id, slug, title, sections }) => (
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
			<DraftMode url={draftUrl} path={`/clientSupport`} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations('menu');
	//const title = t('support');

	return await buildMetadata({
		title: 'Medlem',
		pathname: getPathname({ locale, href: '/medlem' }),
		locale,
	});
}
