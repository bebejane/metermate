import s from './page.module.scss';
import { PartnerDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';
import { getPathname } from '@/i18n/routing';
import Article from '@/components/layout/Article';
import Content from '@/components/common/Content';

export default async function Partners({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const { partner, draftUrl } = await apiQuery(PartnerDocument, {
		variables: {
			locale,
		},
	});

	if (!partner) return notFound();
	const { title, intro, examples } = partner;

	return (
		<>
			<Article title={title} intro={intro}>
				<ul className={s.examples}>
					{examples.map(({ id, logo, text, url }) => (
						<li key={id}>
							<a href={url}>
								<img className={s.logo} src={logo.url} alt={logo.alt} />
							</a>
							<Content content={text} />
						</li>
					))}
				</ul>
			</Article>
			<DraftMode url={draftUrl} path={`/partners`} />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations('menu');
	const { partner } = await apiQuery(PartnerDocument, {
		variables: {
			locale,
		},
	});

	return await buildMetadata({
		title: partner?.seo?.title ?? t('partners'),
		description: partner?.seo?.description,
		pathname: getPathname({ locale, href: '/partners' }),
		locale,
	});
}
