import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

//export const locales = ['sv', 'en'];
export const locales = ['sv'];
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
		},
		'/referenser': {
			en: '/references',
		},
		'/partners': {
			en: '/partners',
		},
		'/support': {
			en: '/support',
		},
		'/om': {
			en: '/about-us',
		},
	},
});

export type AppPathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
