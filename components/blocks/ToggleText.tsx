'use client';

import s from './ToggleText.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';
import { useStore, useShallow } from '@/lib/store';

export type ToggleTextProps = {
	data: ToggleTextRecord;
};

export default function ToggleText({ data }: ToggleTextProps) {
	const [openToggleTextId, setOpenToggleTextId] = useStore(
		useShallow((state) => [state.openToggleTextId, state.setOpenToggleTextId])
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
			<h3 onClick={handleToggle}>
				{headline}
				<span className={cn(isOpen && s.open)}>▾</span>
			</h3>

			{isOpen && text && <Content content={text} />}
		</section>
	);
}
