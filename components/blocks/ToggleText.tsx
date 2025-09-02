'use client';

import s from './ToggleText.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';
import { useState } from 'react';

export type ToggleTextProps = {
	data: ToggleTextRecord;
};

export default function ToggleText({ data: { headline, text } }: ToggleTextProps) {
	const [show, setShow] = useState(false);

	return (
		<section className={s.toggletext}>
			<h3 onClick={() => setShow(!show)}>{headline}</h3>
			<span className={cn(show && s.open)}>▾</span>
			{show && <Content content={text} />}
		</section>
	);
}
