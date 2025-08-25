import { getTranslations } from 'next-intl/server';

export type MenuItem = {
	id: string;
	title: string;
	slug?: string;
	href?: string;
	sub?: MenuItem[];
	position?: 'right' | 'left';
};

export type Menu = MenuItem[];

export const buildMenu = async (locale: SiteLocale): Promise<Menu> => {
	const t = await getTranslations('menu');

	const menu: Menu = [
		{
			id: 'products',
			title: t('products'),
			position: 'left',
		},
		{
			id: 'references',
			title: t('references'),
			slug: '/referenser',
			position: 'left',
		},
		{
			id: 'partners',
			title: t('partners'),
			slug: '/partners',
			position: 'left',
		},
		{
			id: 'support',
			title: t('support'),
			slug: '/support',
			position: 'left',
		},
		{
			id: 'about',
			title: t('about'),
			slug: '/om',
			position: 'left',
		},
		{
			id: 'contact',
			title: t('contact'),
			position: 'right',
		},
		{
			id: 'login',
			title: t('login'),
			slug: '/logga-in',
			position: 'right',
		},
		{
			id: 'language',
			title: t('language'),
			position: 'right',
		},
	];
	return menu;
};
