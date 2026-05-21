import 'dotenv/config';
import {
	DatoCmsConfig,
	getItemReferenceRoutes,
	getUploadReferenceRoutes,
	getItemWithLinked,
} from 'next-dato-utils/config';
import { getPathname, defaultLocale, locales } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { AllProductsDocument } from '@/graphql';
import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const config = {
	i18n: {
		defaultLocale,
		locales,
	},
	routes: {
		start: async (record, locale) => [getPathname({ locale, href: '/', forcePrefix: true })],
		partner: async (record, locale) => [
			getPathname({ locale, href: '/partners', forcePrefix: true }),
		],
		about: async (record, locale) => [getPathname({ locale, href: '/om', forcePrefix: true })],
		product: async ({ id }, locale) => {
			const { slug, category, product_type } = await getItemWithLinked(id);
			return [
				getPathname({
					locale,
					href: {
						pathname: '/produkter/[category]/[productType]/[product]',
						params: { product: slug, category: category.slug, productType: product_type.slug },
					},
					forcePrefix: true,
				}),
			];
		},
		product_type: async ({ id }, locale) => getItemReferenceRoutes(id, locales),
		product_category: async ({ id }, locale) => getItemReferenceRoutes(id, locales),
		product_variant: async ({ id }, locale) => getItemReferenceRoutes(id, locales),
		privacy_policy: async (record, locale) => [
			getPathname({ locale, href: '/privacy-policy', forcePrefix: true }),
		],
		reference: async (record, locale) => [
			getPathname({ locale, href: '/referenser', forcePrefix: true }),
		],
		support: async (record, locale) => [
			getPathname({ locale, href: '/support', forcePrefix: true }),
		],
		support_start: async (record, locale) => [
			getPathname({ locale, href: '/support', forcePrefix: true }),
		],
		contact: async (record, locale) => [getPathname({ locale, href: '/', forcePrefix: true })],
		footer: async (record, locale) => [getPathname({ locale, href: '/', forcePrefix: true })],
		client_support: async (item, locale) => [getPathname({ locale, href: '/', forcePrefix: true })],
		client_support_start: async (item, locale) => [
			getPathname({ locale, href: '/', forcePrefix: true }),
		],
		upload: async ({ id }) => getUploadReferenceRoutes(id, locales),
	},
	sitemap: async () => {
		const locale = defaultLocale;
		const { allProducts } = await apiQuery(AllProductsDocument, {
			variables: {
				locale: locale as SiteLocale,
			},
		});

		const staticRoutes = Object.keys(routing.pathnames)
			.filter((p) => !p.includes('['))
			.map((pathname) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`,
				lastModified: new Date().toISOString(),
				changeFrequency: pathname === '/' ? 'weekly' : 'monthly',
				priority: pathname === '/' ? 1 : 0.8,
			}));

		const productRoutes = allProducts.map((product) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/produkter/${product.category?.slug}/${product.productType?.slug}/${product.slug}`,
			lastModified: new Date().toISOString(),
			changeFrequency: 'weekly',
			priority: 0.8,
		}));

		return [...staticRoutes, ...productRoutes] as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		return {
			name: 'MeterMate',
			short_name: 'MeterMate',
			description: 'MeterMate website',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
				disallow: '/medlem/',
			},
		};
	},
} satisfies DatoCmsConfig;

export default config;
