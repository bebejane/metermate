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
		<section className={s.hero}>
			<VideoPlayer data={start.film} className={s.player} videoClassName={s.video} />
			<header>
				<h1 className={s.title} key={index}>
					{start.filmText[index]?.text}
				</h1>
			</header>
		</section>
	);
}
