import { getTranslations } from 'next-intl/server';

export type MenuItem = {
	id: string;
	title: string;
	slug?: string;
	href?: string;
	sub?: MenuItem[];
};

export type Menu = MenuItem[];

export const buildMenu = async (locale: SiteLocale): Promise<Menu> => {
	const t = await getTranslations('menu');

	const menu: Menu = [
		{
			id: 'products',
			title: t('products'),
			slug: '/produkter',
		},
		{
			id: 'references',
			title: t('references'),
			slug: '/referenser',
		},
		{
			id: 'partners',
			title: t('partners'),
			slug: '/partners',
		},
		{
			id: 'support',
			title: t('support'),
			slug: '/support',
		},
		{
			id: 'about',
			title: t('about'),
			slug: '/om',
		},
		{
			id: 'login',
			title: t('login'),
			slug: '/logga-in',
		},
		{
			id: 'language',
			title: t('language'),
		},
	];
	return menu;
};
