'use client';

import s from './ToggleText.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';
import { useState } from 'react';

export type ToggleTextProps = {
	data: ToggleTextRecord;
};

export default function ToggleText({ data }: ToggleTextProps) {
	const [show, setShow] = useState(false);
	
	const headline = data?.headline;
	const text = data?.text;

	if (!headline) return null;

	return (
		<section className={s.toggletext}>
			<h3 onClick={() => setShow(!show)}>{headline}</h3>
			<span className={cn(show && s.open)}>▾</span>
			{show && text && <Content content={text} />}
		</section>
	);
}
