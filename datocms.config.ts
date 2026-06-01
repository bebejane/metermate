import 'dotenv/config';
import {
	DatoCmsConfig,
	getItemReferenceRoutes,
	getUploadReferenceRoutes,
	getItemWithLinked,
} from 'next-dato-utils/config';
import { getInternalPath, getPathname, defaultLocale, locales } from '@/i18n/routing';
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
		start: async (record, locale) => [getInternalPath('/', locale)],
		partner: async (record, locale) => [
			getInternalPath('/partners', locale),
		],
		about: async (record, locale) => [getInternalPath('/om', locale)],
		product: async ({ id }, locale) => {
			const { slug, category, product_type } = await getItemWithLinked(id);
			return [
				getInternalPath('/produkter/[category]/[productType]/[product]', locale, {
					product: slug, category: category.slug, productType: product_type.slug,
				}),
			];
		},
		product_type: async ({ id }, locale) => getItemReferenceRoutes(id, locales),
		product_category: async ({ id }, locale) => getItemReferenceRoutes(id, locales),
		product_variant: async ({ id }, locale) => getItemReferenceRoutes(id, locales),
		privacy_policy: async (record, locale) => [
			getInternalPath('/privacy-policy', locale),
		],
		reference: async (record, locale) => [
			getInternalPath('/referenser', locale),
		],
		support: async (record, locale) => [
			getInternalPath('/support', locale),
		],
		support_start: async (record, locale) => [
			getInternalPath('/support', locale),
		],
		contact: async (record, locale) => [getInternalPath('/', locale)],
		footer: async (record, locale) => [getInternalPath('/', locale)],
		client_support: async (item, locale) => [getInternalPath('/', locale)],
		client_support_start: async (item, locale) => [
			getInternalPath('/', locale),
		],
		upload: async ({ id }) => getUploadReferenceRoutes(id, locales),
	},
	sitemap: async () => {
		const otherLocales = locales.filter((l) => l !== defaultLocale);

		const { allProducts } = await apiQuery(AllProductsDocument, {
			variables: {
				locale: defaultLocale as SiteLocale,
			},
		});

		const staticRoutes = Object.keys(routing.pathnames)
			.filter((p) => !p.includes('['))
			.map((pathname) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: pathname as any }, locale: defaultLocale })}`,
				lastModified: new Date().toISOString(),
				changeFrequency: pathname === '/' ? 'weekly' : 'monthly',
				priority: pathname === '/' ? 1 : 0.8,
				alternates: {
					languages: otherLocales.reduce(
						(acc, l) => {
							acc[l] = `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({ href: { pathname: pathname as any }, locale: l })}`;
							return acc;
						},
						{} as Record<string, string>,
					),
				},
			}));

		const productRoutes = allProducts.map(({ slug, category, productType }) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({
				href: {
					pathname: '/produkter/[category]/[productType]/[product]',
					params: { product: slug, category: category?.slug, productType: productType?.slug },
				},
				locale: defaultLocale,
			})}`,
			lastModified: new Date().toISOString(),
			changeFrequency: 'weekly',
			priority: 0.8,
			alternates: {
				languages: otherLocales.reduce(
					(acc, l) => {
						acc[l] = `${process.env.NEXT_PUBLIC_SITE_URL}${getPathname({
							href: {
								pathname: '/produkter/[category]/[productType]/[product]',
								params: { product: slug, category: category?.slug, productType: productType?.slug },
							},
							locale: l,
						})}`;
						return acc;
					},
					{} as Record<string, string>,
				),
			},
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
