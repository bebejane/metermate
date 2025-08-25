'use client';

import s from './Navbar.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Menu, MenuItem } from '@/lib/menu';
import Content from '@/components/common/Content';

export type NavbarProps = {
	menu: Menu;
	contact: ContactQuery['contact'];
};

export default function Navbar({ menu, contact }: NavbarProps) {
	const path = usePathname();
	const qs = useSearchParams().toString();
	const pathname = `${path}${qs.length > 0 ? `?${qs}` : ''}`;
	const [selected, setSelected] = useState<string | null>(null);
	const [showContact, setShowContact] = useState(false);
	const [showProducts, setShowProducts] = useState(false);
	const logoRef = useRef<HTMLImageElement>(null);

	const left = menu.filter((item) => item.position === 'left');
	const right = menu.filter((item) => item.position === 'right');

	function isSelected(item: MenuItem) {
		return pathname.startsWith(item.slug) || pathname === item.slug;
	}

	function handleLeave() {
		setSelected(null);
	}

	function handleLeaveSub() {
		console.log('leave');
		setShowContact(false);
		setShowProducts(false);
	}

	function handleEnter(id: string) {
		setSelected(id);
		setShowContact(id === 'contact');
		setShowProducts(id === 'products');
	}

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
			<div className={cn(s.sub, (showContact || showProducts) && s.show)} onMouseLeave={handleLeaveSub}>
				{showContact && <Content content={contact.text} className={s.contact} />}
				{showProducts && <div>products</div>}
			</div>
		</>
	);
}
