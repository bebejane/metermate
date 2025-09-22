'use client';

import { useEffect, useState } from 'react';
import s from './ClientSupportMenu.module.scss';
import cn from 'classnames';
import useIsDesktop from '@/lib/hooks/useIsDesktop';

export type SupportMenuProps = {
	allClientSupports: AllClientSupportsQuery['allClientSupports'];
};

export default function SupportMenu({ allClientSupports }: SupportMenuProps) {
	const [active, setActive] = useState<string | null>(null);
	const [toggles, setToggles] = useState<any>({});
	const isDesktop = useIsDesktop();

	function handleClick(e: React.MouseEvent<HTMLElement>) {
		const slug = e.currentTarget.getAttribute('data-slug');
		setToggles((t: any) => (isDesktop ? { ...t, [slug]: t[slug] ? false : true } : { [slug]: t[slug] ? false : true }));
	}

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActive(entry.target.getAttribute('data-slug'));
				}
			});
		});

		allClientSupports.forEach(({ slug }) => {
			observer.observe(document.querySelector(`[data-slug="${slug}"]`));
		});

		return () => {
			allClientSupports.forEach(({ slug }) => {
				const el = document.querySelector(`[data-slug="${slug}"]`);
				el && observer.unobserve(el);
			});
		};
	}, []);

	return (
		<ul className={s.menu}>
			{allClientSupports.map(({ id, title, sections, slug }) => (
				<li key={id}>
					<span data-slug={slug} className={cn(toggles[slug] && s.active)} key={id} onClick={handleClick}>
						{title}
					</span>
					<ul className={cn(toggles[slug] && s.show)}>
						{sections.map((item) => (
							<li id={`${item.slug}`} key={item.id}>
								<a href={`#${slug}-${item.slug}`}>{item.title}</a>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
