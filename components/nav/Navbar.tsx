'use client';

import s from './Navbar.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import { getPathname, Link, locales } from '@/i18n/routing';
import { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem } from '@/lib/menu';
import Content from '@/components/content/Content';
import { Image } from 'react-datocms';
import { useSession } from 'next-auth/react';
import { useStore, useShallow } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { capitalize } from 'next-dato-utils/utils';

export type NavbarProps = {
	menu: Menu;
	contact: ContactQuery['contact'];
	allProducts: AllProductsQuery['allProducts'];
	locale: SiteLocale;
};

export default function Navbar({ menu, contact, allProducts, locale }: NavbarProps) {
	const t = useTranslations('Common');
	const { status } = useSession();
	const path = usePathname();
	const qs = useSearchParams().toString();
	const pathname = `${path}${qs.length > 0 ? `?${qs}` : ''}`;
	const [subMenu, setSubMenu] = useStore(useShallow((state) => [state.subMenu, state.setSubMenu]));
	const logoRef = useRef<HTMLImageElement>(null);
	const left = menu.filter((item) => item.position === 'left');
	const right = menu
		.filter((item) => item.position === 'right' && item.id !== 'language')
		.map((item) =>
			item.id === 'login' && status === 'authenticated'
				? { ...item, title: t('member'), slug: '/medlem' }
				: item,
		);

	function isSelected(item: MenuItem) {
		if (!item.slug) return false;
		return locales.find((l) => {
			const path = getPathname({ locale: l, href: { pathname: item.slug as any } });
			return pathname.startsWith(path) || pathname === path;
		});
	}

	function handleLeaveSub() {
		setSubMenu(null);
	}

	function handleClick(id: any) {
		setSubMenu(subMenu === id ? null : id);
	}

	useEffect(() => {
		setSubMenu(null);
	}, [pathname]);

	return (
		<>
			<nav className={cn(s.navbar)}>
				<figure className={s.logo}>
					<Link href={'/'}>
						<img src='/images/logo.svg' alt={t('logoAlt')} ref={logoRef} />
					</Link>
				</figure>

				<ul className={s.menu}>
					{left.map((item, idx) => (
						<li
							id={`${item.id}-menu`}
							key={`${item.id}-menu`}
							className={cn(isSelected(item) && s.active)}
						>
							{item.slug && !item.sub ? (
								<Link href={item.slug} prefetch={true}>
									{item.title}
								</Link>
							) : (
								<span onClick={() => handleClick(item.id ?? null)}>{item.title}</span>
							)}
						</li>
					))}
				</ul>

				<ul className={cn(s.menu, s.right)}>
					{right.map((item, idx) => (
						<li
							id={`${item.id}-menu`}
							key={`${item.id}-menu`}
							className={cn(isSelected(item) && s.active)}
						>
							{item.slug && !item.sub ? (
								<Link href={item.slug}>{item.title}</Link>
							) : (
								<span onClick={() => handleClick(item.id ?? null)}>{item.title}</span>
							)}
						</li>
					))}
					<li className={s.language}>
						{locales
							.filter((l) => l !== locale)
							.map((l) => (
								<Link href='/' locale={l}>
									{capitalize(l)}
								</Link>
							))}
					</li>
				</ul>
			</nav>
			<div
				className={cn(s.sub, subMenu === 'contact' && s.show, s.contact)}
				onMouseLeave={handleLeaveSub}
			>
				<Content content={contact.text} className={s.content} />
			</div>
			<div
				className={cn(s.sub, subMenu === 'products' && s.show, s.products)}
				onMouseLeave={handleLeaveSub}
			>
				<div className={s.products}>
					<ul>
						{allProducts
							?.filter(({ forIndividuals }) => !forIndividuals)
							.map((product) => (
								<Link
									key={product.id}
									prefetch={true}
									href={{
										pathname: '/produkter/[category]/[productType]/[product]',
										params: {
											product: product.slug,
											category: product.category?.slug,
											productType: product.productType?.slug,
										},
									}}
								>
									<li
										data-datocms-content-link-url={product._editingUrl}
										data-datocms-content-link-group
									>
										{product.thumb?.responsiveImage && (
											<Image data={product.thumb.responsiveImage} />
										)}
										<h5>{product.variant?.title}</h5>
									</li>
								</Link>
							))}
					</ul>
				</div>
			</div>
		</>
	);
}
