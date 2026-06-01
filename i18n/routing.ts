import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const locales = ['sv', 'en', 'fi'];
export const defaultLocale = 'sv';
export const localePrefix = 'as-needed';
export const routing = defineRouting({
	locales,
	localePrefix,
	defaultLocale,
	localeDetection: false,
	pathnames: {
		'/': '/',
		'/produkter': {
			en: '/products',
			fi: '/tuotteet',
		},
		'/produkter/[category]/[productType]/[product]': {
			en: '/products/[category]/[productType]/[product]',
			fi: '/tuotteet/[category]/[productType]/[product]',
		},
		'/referenser': {
			en: '/references',
			fi: '/referenssit',
		},
		'/partners': {
			en: '/partners',
			fi: '/kumppanit',
		},
		'/support': {
			en: '/support',
			fi: '/tuki',
		},
		'/om': {
			en: '/about-us',
			fi: '/tietoa-meista',
		},
		'/logga-in': {
			en: '/login',
			fi: '/kirjaudu',
		},
		'/logga-ut': {
			en: '/logout',
			fi: '/kirjaudu-ulos',
		},
		'/medlem': {
			en: '/member',
			fi: '/jasen',
		},
		'/privacy-policy': {
			en: '/privacy-policy',
			fi: '/tietosuojakaytanto',
		},
	},
});

export type AppPathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export function getInternalPath(
	pathname: string,
	locale?: string,
	params?: Record<string, string>,
): string {
	const href = params ? { pathname, params } : ({ pathname } as any);
	try {
		const path = getPathname({ locale: defaultLocale, href, forcePrefix: false });
		return `/${locale}${path}`;
	} catch (e) {
		console.log(e);
		return pathname;
	}
}
