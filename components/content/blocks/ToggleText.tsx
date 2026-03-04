'use client';

import s from './ToggleText.module.scss';
import cn from 'classnames';
import Content from '@/components/content/Content';
import { useStore, useShallow } from '@/lib/store';

export type ToggleTextProps = {
	data: ToggleTextRecord;
};

export default function ToggleText({ data }: ToggleTextProps) {
	const [openToggleTextId, setOpenToggleTextId] = useStore(
		useShallow((state) => [state.openToggleTextId, state.setOpenToggleTextId]),
	);

	const headline = data?.headline;
	const text = data?.text;
	const isOpen = openToggleTextId === data?.id;

	if (!headline) return null;

	const handleToggle = () => {
		setOpenToggleTextId(isOpen ? null : data?.id);
	};

	return (
		<section className={s.toggletext}>
			<h5 onClick={handleToggle}>
				{headline}
				<span className={cn(isOpen && s.open)}>▾</span>
			</h5>

			{isOpen && text && <article className={s.text}>
				<Content content={text} /></article>}
		</section>
	);
}
