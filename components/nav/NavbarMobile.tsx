'use client';

import s from './NavbarMobile.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@/lib/menu';
import { Image } from 'react-datocms';
import Hamburger from './Hamburger';
import { useSession } from 'next-auth/react';
import Content from '@/components/common/Content';

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
	const [sub, setSub] = useState<'contact' | 'products' | null>(null);
	const top = menu.filter((item) => item.position === 'left' || item.id === 'contact');

	const bottom = menu
		.filter((item) => item.position === 'right')
		.map((item) =>
			item.id === 'login' && status === 'authenticated' ? { ...item, title: 'Medlem', slug: '/medlem' } : item
		);

	function handleClick(id: string) {
		setSelected(id);
		setSub(id === 'contact' ? 'contact' : id === 'products' ? 'products' : null);
	}
	function isSelected(item: MenuItem) {
		if (sub) return sub === item.id;
		return pathname === item.slug;
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
							className={cn(sub && s.dropdown, isSelected(item) && s.active)}
							onClick={() => handleClick(selected === item.id ? null : item.id)}
						>
							{item.slug ? <Link href={item.slug}>{item.title}</Link> : <span>{item.title}</span>}
							{item.id === 'products' && sub === 'products' && (
								<ul>
									{allProducts?.map(({ id, title, image, slug }) => (
										<li key={id}>
											<Link
												key={id}
												href={{
													pathname: '/produkter/[product]',
													params: { product: slug },
												}}
											>
												{title}
											</Link>
										</li>
									))}
								</ul>
							)}
							{item.id === 'contact' && sub === 'contact' && <Content content={contact.text} className={s.contact} />}
						</li>
					))}
				</ul>
				<div className={s.help}>
					<h3>Behöver du hjälp?</h3>
					<p>Vi har samlat allt du behöver veta för att få igång din MeterMate-dongel här.</p>
				</div>
			</nav>
		</>
	);
}
