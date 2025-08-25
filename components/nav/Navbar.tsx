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
	const [selected, setSelected] = useState<string | null>(null);
	const [sub, setSub] = useState<'contact' | 'products' | null>(null);

	const logoRef = useRef<HTMLImageElement>(null);
	const subRef = useRef<HTMLDivElement>(null);
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
			(item.id === 'products' && sub === 'products') ||
			(item.id === 'contact' && sub === 'contact')
		);
	}

	function handleLeave() {
		setSelected(null);
	}

	function handleLeaveSub() {
		setSub(null);
	}

	function handleEnter(id: string) {
		setSelected(id);
		setSub(id === 'contact' ? 'contact' : id === 'products' ? 'products' : null);
	}

	useEffect(() => {
		if (subRef.current) {
			setSubHeight(subRef.current.scrollHeight);
		}
	}, [sub]);

	return (
		<>
			<nav className={cn(s.navbar)}>
				<figure className={s.logo}>
					<Link href={'/'}>
						<img src='/images/logo.svg' alt='Logo' ref={logoRef} />
					</Link>
				</figure>

				<ul className={s.menu} onMouseLeave={handleLeave}>
					{left.map((item, idx) => (
						<li
							id={`${item.id}-menu`}
							key={`${item.id}-menu`}
							className={cn(isSelected(item) && s.active)}
							onMouseEnter={() => handleEnter(item.id ?? null)}
						>
							{item.slug ? <Link href={item.slug}>{item.title}</Link> : <span>{item.title}</span>}
						</li>
					))}
				</ul>

				<ul className={cn(s.menu, s.right)}>
					{right.map((item, idx) => (
						<li
							id={`${item.id}-menu`}
							key={`${item.id}-menu`}
							className={cn(isSelected(item) && s.active)}
							onMouseEnter={() => handleEnter(item.id ?? null)}
						>
							{item.slug ? <Link href={item.slug}>{item.title}</Link> : <span>{item.title}</span>}
						</li>
					))}
				</ul>
			</nav>
			<div className={cn(s.sub, sub && s.show, s[sub])} onMouseLeave={handleLeaveSub}>
				{sub === 'contact' && <Content content={contact.text} className={s.content} />}
				{sub === 'products' && (
					<div className={s.products}>
						<ul>
							{allProducts?.map((product) => (
								<Link
									key={product.id}
									href={{
										pathname: '/produkter/[product]',
										params: { product: product.slug },
									}}
								>
									<li>
										<Image data={product.image.responsiveImage} />
										<h5>{product.title}</h5>
									</li>
								</Link>
							))}
						</ul>
					</div>
				)}
			</div>
		</>
	);
}
