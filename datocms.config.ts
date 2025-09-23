import 'dotenv/config';
import { DatoCmsConfig } from 'next-dato-utils/config';
import client from './lib/client';
import { getPathname, defaultLocale } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { AllProductsDocument } from '@/graphql';
import { MetadataRoute } from 'next';
import { ApiError } from '@datocms/cma-client';
import { routing } from '@/i18n/routing';

const routes: DatoCmsConfig['routes'] = {
	start: async (record, locale) => [getPathname({ locale, href: '/' })],
	partner: async (record, locale) => [getPathname({ locale, href: '/partners' })],
	about: async (record, locale) => [getPathname({ locale, href: '/om' })],
	product: async ({ slug, category, product_type }, locale) => [
		getPathname({
			locale,
			href: {
				pathname: '/produkter/[category]/[productType]/[product]',
				params: { product: slug, category: category.slug, productType: product_type.slug },
			},
		}),
	],
	product_type: async (record, locale) => references(record.id, [locale]),
	product_category: async (record, locale) => references(record.id, [locale]),
	product_variant: async (record, locale) => references(record.id, [locale]),
	reference: async (record, locale) => [getPathname({ locale, href: '/referenser' })],
	support: async (record, locale) => [getPathname({ locale, href: '/support' })],
	support_start: async (record, locale) => [getPathname({ locale, href: '/support' })],
	contact: async (record, locale) => [getPathname({ locale, href: '/' })],
	footer: async (record, locale) => [getPathname({ locale, href: '/' })],
	upload: async (record, locale) => references(record.id, routing.locales, { upload: true }),
};

const config = {
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
		defaultLocale: routing.defaultLocale,
		locales: routing.locales,
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
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/produkter/${product.category?.slug}/${product.productType?.slug}/${product.slug}`,
					lastModified: new Date().toISOString(),
					changeFrequency: 'weekly',
					priority: 0.8,
				}))
			) as MetadataRoute.Sitemap;
	},
} satisfies DatoCmsConfig;

export default config;

async function references(itemId: string, locales: string[], opt = { upload: false }): Promise<string[] | null> {
	if (!itemId) throw new Error('datocms.config: Missing reference: itemId');
	const paths: string[] = [];

	try {
		const itemTypes = await client.itemTypes.list();
		const items = await client[opt.upload ? 'uploads' : 'items'].references(itemId, {
			version: 'published',
			limit: 500,
			nested: true,
		});

		for (const item of items) {
			const itemType = itemTypes.find(({ id }) => id === item.item_type.id);
			if (!itemType) continue;
			const record = await loadRecordWithLinked(item.id);
			for (const locale of locales) {
				const p = await routes[itemType.api_key]?.(record, locale);
				p && paths.push.apply(paths, p);
			}
		}
	} catch (e) {
		console.error((e as ApiError).message);
		throw e.message;
	}
	return paths;
}

export async function loadRecordWithLinked(id: string): Promise<any> {
	// 1) Get the record, expand blocks if you need them
	const record = await client.items.find(id, { nested: true, version: 'current' });

	// 2) Discover link fields for this model
	const itemTypeId = record.item_type.id;
	const fields = await client.fields.list(itemTypeId);
	const linkFields = fields.filter((f) => f.field_type === 'link' || f.field_type === 'links');

	// 3) Collect referenced IDs from those fields
	const ids = new Set<string>();
	for (const f of linkFields) {
		const value = (record as any)[f.api_key];
		if (!value) continue;
		if (Array.isArray(value)) value.forEach((v) => ids.add(v));
		else ids.add(value);
	}

	// 4) Bulk fetch linked records, if any
	const linkedRecords = ids.size
		? await client.items.list({
				filter: { ids: Array.from(ids).join(',') },
				version: 'current',
			})
		: [];

	Object.keys(record).forEach((key) => {
		record[key] = linkedRecords.find((r) => r.id === record[key]) ?? record[key];
	});
	return record;
}
