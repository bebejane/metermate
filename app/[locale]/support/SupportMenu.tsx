'use client';

import { use, useEffect, useState } from 'react';
import s from './SupportMenu.module.scss';
import cn from 'classnames';
import useIsDesktop from '@/lib/hooks/useIsDesktop';

export type SupportMenuProps = {
	allSupports: AllSupportsQuery['allSupports'];
};

export default function SupportMenu({ allSupports }: SupportMenuProps) {
	const [active, setActive] = useState<string | null>(null);
	const [activeItem, setActiveItem] = useState<string | null>(null);
	const [toggles, setToggles] = useState<any>({});
	const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
	const isDesktop = useIsDesktop();

	function handleClick(e: React.MouseEvent<HTMLElement>) {
		const slug = e.currentTarget.getAttribute('data-slug');
		setToggles((t: any) =>
			isDesktop ? { ...t, [slug]: t[slug] ? false : true } : { [slug]: t[slug] ? false : true },
		);
	}

	useEffect(() => {
		setShowSubMenu(toggles[active] ? true : false);
		//else setShowSubMenu(toggles[active] ? true : false);
	}, [isDesktop, toggles]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					if (entry.target.getAttribute('data-item-slug'))
						setActiveItem(entry.target.getAttribute('data-item-slug'));

					if (entry.target.getAttribute('data-support-slug')) {
						setActive(entry.target.getAttribute('data-support-slug'));
					}
				});
			},
			{
				rootMargin: '0px 0px 0px 0px',
				//@ts-ignore
				trackVisibility: true,
				delay: 100,
			},
		);

		const supports = allSupports.map(({ slug }) =>
			document.querySelector(`[data-support-slug="${slug}"]`),
		);

		const items = allSupports
			.map(({ sections }) => sections)
			.flat()
			.map(({ slug }) => document.querySelector(`[data-item-slug="${slug}"]`));

		[...supports, ...items].forEach((el) => observer.observe(el));

		return () => {
			[...supports, ...items].forEach((el) => observer.observe(el));
		};
	}, []);

	return (
		<ul className={s.menu}>
			{allSupports.map(({ id, title, sections, slug }) => (
				<li key={id}>
					<span
						className={cn(toggles[slug] && s.active)}
						data-slug={slug}
						key={id}
						onClick={handleClick}
					>
						{title}
					</span>
					<ul className={cn(toggles[slug] && s.show)}>
						{sections.map((item) => (
							<li
								id={`${item.slug}`}
								key={item.id}
								className={cn(activeItem === item.slug && s.active)}
								onClick={() => {
									if (!isDesktop) {
										setToggles((prev) => ({ ...prev, [slug]: false }));
										setShowSubMenu(false);
									}
								}}
							>
								<a href={`#${slug}-${item.slug}`}>{item.title}</a>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
