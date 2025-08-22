import 'dotenv/config';
import { DatoCmsConfig } from 'next-dato-utils/config';
import client from './lib/client';
import { AllProjectsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { getPathname, defaultLocale } from '@/i18n/routing';

const routes: DatoCmsConfig['routes'] = {
	start: async (record, locale) => [getPathname({ locale, href: '/' })],
	about: async (record, locale) => [getPathname({ locale, href: '/om-oss' })],
	contact: async (record, locale) => [getPathname({ locale, href: '/kontakt' })],
	offer: async (record, locale) => [getPathname({ locale, href: '/erbjudande' })],
	join_us: async (record, locale) => [getPathname({ locale, href: '/bli-en-av-oss' })],
	join: async (record, locale) => [getPathname({ locale, href: '/bli-en-av-oss' })],
	showcase: async (record, locale) => [getPathname({ locale, href: '/projekt' })],
	staff: async (record, locale) => [getPathname({ locale, href: '/om-oss' })],
	client: async (record, locale) => [getPathname({ locale, href: `/projekt` }), getPathname({ locale, href: '/' })],
	project: async ({ slug }, locale) => {
		return [
			getPathname({
				locale,
				href: { pathname: `/projekt/[project]`, params: { project: slug[locale] ?? slug } },
			}),
			getPathname({ locale, href: '/projekt' }),
			getPathname({ locale, href: '/' }),
		];
	},
	project_footer: async (record, locale) => {
		const { allProjects } = await apiQuery<AllProjectsQuery, AllProjectsQueryVariables>(AllProjectsDocument, {
			all: true,
			variables: { locale: locale as SiteLocale },
		});
		const paths = allProjects.map(({ slug }) =>
			getPathname({
				locale,
				href: { pathname: `/projekt/[project]`, params: { project: slug } },
			})
		);
		return paths;
	},
	upload: async (record, locale) => {
		console.log(record);
		return references(record.id, true);
	},
};

export default {
	name: 'Metermate',
	description: 'Metermate',
	url: {
		dev: 'http://localhost:3000',
		public: 'https://metermate.vercel.app',
	},
	theme: {
		background: '#efefef',
		color: '#cd3a00',
	},
	i18n: {
		defaultLocale: 'sv',
		locales: ['sv', 'en'],
	},
	routes,
	sitemap: async (locale = 'sv') => {
		return ['/projekt'].map((p) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}${p}`,
			lastModified: new Date().toISOString(),
			changeFrequency: 'weekly',
			priority: 0.8,
		}));
	},
} satisfies DatoCmsConfig;

async function references(itemId: string, upload: boolean = false): Promise<string[]> {
	if (!itemId) throw new Error('datocms.config: Missing reference: itemId');

	const paths: string[] = [];
	const itemTypes = await client.itemTypes.list();

	const items = await client[upload ? 'uploads' : 'items'].references(itemId, {
		version: 'published',
		limit: 500,
		nested: true,
	});

	for (const item of items) {
		const itemType = itemTypes.find(({ id }) => id === item.item_type.id);
		if (!itemType) continue;
		const p = await routes[itemType.api_key]?.(item, defaultLocale);
		p && paths.push.apply(paths, p);
	}

	return paths;
}
