'use client';

import { useInterval } from 'react-use';
import s from './Hero.module.scss';
import { VideoPlayer } from 'next-dato-utils/components';
import { useState } from 'react';

export type StartHeaderProps = {
	start: StartQuery['start'];
};

export default function StartHeader({ start }: StartHeaderProps) {
	const [index, setIndex] = useState<number>(0);
	useInterval(() => {
		setIndex((i) => (i + 1 > start.filmText.length - 1 ? 0 : i + 1));
	}, 5000);

	return (
		<section className={s.hero} data-datocms-content-link-group>
			<span
				data-datocms-content-link-url={start.film._editingUrl}
				data-datocms-content-link-boundary
			>
				<VideoPlayer data={start.film} className={s.player} videoClassName={s.video} />
			</span>
			<header>
				<h1 className={s.title} key={index} data-datocms-content-link-boundary>
					{start.filmText[index]?.text}
				</h1>
			</header>
		</section>
	);
}
