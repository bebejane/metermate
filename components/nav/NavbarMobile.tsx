'use client';

import s from './NavbarMobile.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@/lib/menu';
import Hamburger from './Hamburger';
import { useSession } from 'next-auth/react';
import Content from '@/components/common/Content';
import { useShallow, useStore } from '@/lib/store';

export type NavbarMobileProps = {
	menu: Menu;
	contact: ContactQuery['contact'];
	allProducts: AllProductsQuery['allProducts'];
};

export default function NavbarMobile({ menu, allProducts, contact }: NavbarMobileProps) {
	const { status } = useSession();
	const path = usePathname();
	const qs = useSearchParams().toString();
	const pathname = `${path}${qs.length > 0 ? `?${qs}` : ''}`;
	const [selected, setSelected] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [subMenu, setSubMenu] = useStore(useShallow((state) => [state.subMenu, state.setSubMenu]));
	const top = menu.filter((item) => item.position === 'left');

	const bottom = menu
		.filter((item) => item.position === 'right')
		.map((item) =>
			item.id === 'login' && status === 'authenticated' ? { ...item, title: 'Medlem', slug: '/medlem' } : item
		);

	function handleClick(id: string) {
		setSelected(id);
		setSubMenu(id === 'contact' ? 'contact' : id === 'products' ? 'products' : null);
	}
	function isSelected(item: MenuItem) {
		return (
			pathname.startsWith(item.slug) ||
			pathname === item.slug ||
			(item.id === 'products' && subMenu === 'products') ||
			(item.id === 'contact' && subMenu === 'contact')
		);
	}
	useEffect(() => {
		setOpen(false);
	}, [path, qs]);

	return (
		<>
			<div className={cn(s.topbar, open && s.open)}>
				<figure className={s.logo}>
					<Link href={'/'}>
						<img src={'/images/logo.svg'} alt='Logo' />
					</Link>
				</figure>
				<div className={s.hamburger}>
					<Hamburger toggled={open} color={open ? 'white' : 'black'} size={36} onToggle={(state) => setOpen(state)} />
				</div>
			</div>
			<nav className={cn(s.navbarMobile, open && s.open)}>
				<ul className={s.menu}>
					{top.map((item) => (
						<li
							key={item.id}
							className={cn(subMenu && s.dropdown, isSelected(item) && s.active)}
							onClick={() => handleClick(selected === item.id ? null : item.id)}
						>
							{item.slug && !item.sub ? <Link href={item.slug}>{item.title}</Link> : <span>{item.title}</span>}
							{item.id === 'products' && subMenu === 'products' && (
								<ul>
									{allProducts
										?.filter(({ forIndividuals }) => !forIndividuals)
										.map(({ id, title, variant, slug, category, productType }) => (
											<li key={id}>
												<Link
													key={id}
													href={{
														pathname: '/produkter/[category]/[productType]/[product]',
														params: {
															product: slug,
															category: category?.slug,
															productType: productType?.slug,
														},
													}}
												>
													{variant?.title}
												</Link>
											</li>
										))}
								</ul>
							)}
						</li>
					))}
					{bottom.map((item) => (
						<li
							key={item.id}
							className={cn(subMenu && s.dropdown, isSelected(item) && s.active)}
							onClick={() => handleClick(selected === item.id ? null : item.id)}
						>
							{item.slug && !item.sub ? <Link href={item.slug}>{item.title}</Link> : <span>{item.title}</span>}
							{item.id === 'contact' && subMenu === 'contact' && (
								<Content content={contact.text} className={s.contact} />
							)}
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}
