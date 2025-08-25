import 'dotenv/config';
import { DatoCmsConfig } from 'next-dato-utils/config';
import client from './lib/client';
import { getPathname, defaultLocale } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { AllProductsDocument } from '@/graphql';
import { MetadataRoute } from 'next';

const routes: DatoCmsConfig['routes'] = {
	start: async (record, locale) => [getPathname({ locale, href: '/' })],
	partner: async (record, locale) => [getPathname({ locale, href: '/partners' })],
	about: async (record, locale) => [getPathname({ locale, href: '/om' })],
	product: async (record, locale) => [getPathname({ locale, href: '/produkter' })],
	reference: async (record, locale) => [getPathname({ locale, href: '/referenser' })],
	support: async (record, locale) => [getPathname({ locale, href: '/support' })],
	support_start: async (record, locale) => [getPathname({ locale, href: '/support' })],
	contact: async (record, locale) => [getPathname({ locale, href: '/' })],
	footer: async (record, locale) => [getPathname({ locale, href: '/' })],
	upload: async (record, locale) => references(record.id, true),
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
		color: '#349f49',
	},
	i18n: {
		defaultLocale: 'sv',
		//locales: ['sv', 'en'],
		locales: ['sv'],
	},
	routes,
	sitemap: async (locale = 'sv') => {
		const { allProducts } = await apiQuery<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, {
			variables: {
				locale: locale as SiteLocale,
			},
		});

		return ['/om', '/produkter', '/referenser', '/support']
			.map((p) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}${p}`,
				lastModified: new Date().toISOString(),
				changeFrequency: 'weekly',
				priority: 0.8,
			}))
			.concat(
				allProducts.map((product) => ({
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/produkter/${product.slug}`,
					lastModified: new Date().toISOString(),
					changeFrequency: 'weekly',
					priority: 0.8,
				}))
			) as MetadataRoute.Sitemap;
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
