'use client';

import s from './Navbar.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem } from '@/lib/menu';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';
import { useSession } from 'next-auth/react';
import { useStore, useShallow } from '@/lib/store';

export type NavbarProps = {
	menu: Menu;
	contact: ContactQuery['contact'];
	allProducts: AllProductsQuery['allProducts'];
};

export default function Navbar({ menu, contact, allProducts }: NavbarProps) {
	const { status } = useSession();
	const path = usePathname();
	const qs = useSearchParams().toString();
	const pathname = `${path}${qs.length > 0 ? `?${qs}` : ''}`;
	const [subMenu, setSubMenu] = useStore(useShallow((state) => [state.subMenu, state.setSubMenu]));
	const logoRef = useRef<HTMLImageElement>(null);
	const left = menu.filter((item) => item.position === 'left');
	const right = menu
		.filter((item) => item.position === 'right')
		.map((item) =>
			item.id === 'login' && status === 'authenticated' ? { ...item, title: 'Medlem', slug: '/medlem' } : item
		);

	function isSelected(item: MenuItem) {
		return (
			pathname.startsWith(item.slug) ||
			pathname === item.slug ||
			(item.id === 'products' && subMenu === 'products') ||
			(item.id === 'contact' && subMenu === 'contact')
		);
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
						<img src='/images/logo.svg' alt='Logo' ref={logoRef} />
					</Link>
				</figure>

				<ul className={s.menu}>
					{left.map((item, idx) => (
						<li id={`${item.id}-menu`} key={`${item.id}-menu`} className={cn(isSelected(item) && s.active)}>
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
						<li id={`${item.id}-menu`} key={`${item.id}-menu`} className={cn(isSelected(item) && s.active)}>
							{item.slug && !item.sub ? (
								<Link href={item.slug}>{item.title}</Link>
							) : (
								<span onClick={() => handleClick(item.id ?? null)}>{item.title}</span>
							)}
						</li>
					))}
				</ul>
			</nav>
			<div className={cn(s.sub, subMenu === 'contact' && s.show, s.contact)} onMouseLeave={handleLeaveSub}>
				<Content content={contact.text} className={s.content} />
			</div>
			<div className={cn(s.sub, subMenu === 'products' && s.show, s.products)} onMouseLeave={handleLeaveSub}>
				<div className={s.products}>
					<ul>
						{allProducts?.map((product) => (
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
								<li>
									{product.thumb?.responsiveImage && <Image data={product.thumb.responsiveImage} />}
									<h5>{product.title}</h5>
								</li>
							</Link>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
