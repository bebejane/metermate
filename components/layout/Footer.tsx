'use client';

import s from './Footer.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type FooterProps = {
	footer?: FooterQuery['footer'];
};

export default function Footer({ footer }: FooterProps) {
	const t = useTranslations('Common');
	if (!footer) return null;

	return (
		<footer className={cn(s.footer)}>
			<div className={s.logo}>
				<Link href={'/'}>
					<img src='/images/logo-black.svg' alt={t('logoAlt')} />
				</Link>
			</div>
			<div className={s.text}>{footer.text}</div>
			<div className={s.copyright}>© Jemac Sweden AB {new Date().getFullYear()}</div>
		</footer>
	);
}
