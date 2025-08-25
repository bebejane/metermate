'use client';

import { useEffect, useState } from 'react';
import s from './SupportMenu.module.scss';
import cn from 'classnames';

export type SupportMenuProps = {
	allSupports: AllSupportsQuery['allSupports'];
};

export default function SupportMenu({ allSupports }: SupportMenuProps) {
	const [active, setActive] = useState<string | null>(null);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			console.log(entries);
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActive(entry.target.getAttribute('data-slug'));
				}
			});
		});

		allSupports.forEach(({ slug }) => {
			observer.observe(document.querySelector(`[data-slug="${slug}"]`));
		});

		return () => {
			allSupports.forEach(({ slug }) => {
				const el = document.querySelector(`[data-slug="${slug}"]`);
				el && observer.unobserve(el);
			});
		};
	}, []);

	return (
		<ul className={s.menu}>
			{allSupports.map(({ id, title, sections, slug }) => (
				<li key={id}>
					<a data-slug={slug} className={cn(slug === active && s.active)} key={id} href={`#${slug}`}>
						{title}
					</a>
					<ul>
						{sections.map(({ id, title, slug }) => (
							<li id={slug} key={id}>
								<a href={`#${slug}`}>{title}</a>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
