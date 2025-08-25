'use client';

import s from './Footer.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import Content from '@/components/common/Content';
import classNames from 'classnames';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { use, useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'rooks';
import { getPathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';

type FooterProps = {
	footer?: FooterQuery['footer'];
};

export default function Footer({ footer }: FooterProps) {
	if (!footer) return null;

	return (
		<footer className={cn(s.footer)}>
			<div className={s.logo}>
				<Link href={'/'}>
					<img src='/images/logo-black.svg' alt='Logo' />
				</Link>
			</div>
			<div className={s.text}>{footer.text}</div>
			<div className={s.copyright}>© Jemac Sweden AB {new Date().getFullYear()}</div>
		</footer>
	);
}
