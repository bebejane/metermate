'use client';

import s from './Cta.module.scss';
import Content from '@/components/common/Content';
import cn from 'classnames';
import { useStore, useShallow } from '@/lib/store';

export type CTAProps = {
	data: CtaRecord;
};

export default function Cta({ data: { text } }: CTAProps) {
	const [setSubMenu, setOpenMobileMenu] = useStore(useShallow((state) => [state.setSubMenu, state.setOpenMobileMenu]));
	return (
		<section className={cn(s.cta)} onClick={() => {
			setSubMenu('contact');
			setOpenMobileMenu(true);
		}}>
			<h2>{text && <Content content={text} />}</h2>
		</section>
	);
}
