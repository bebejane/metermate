'use client';

import s from './LogoutForm.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function LogoutForm() {
	const t = useTranslations('Logout');
	useEffect(() => {
		signOut({ callbackUrl: '/' });
	}, []);

	return (
		<div className={cn('structured', 'grid')}>
			<div>{t('loggingOut')}</div>
		</div>
	);
}
