'use client';

import s from './LoginForm.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
	const t = useTranslations('Login');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSignin = async (e) => {
		e.preventDefault();
		const url = new URLSearchParams(window.location.search).get('callbackUrl');
		const callbackUrl = url ?? '/medlem';
		const formData = new FormData(e.target);
		try {
			setError(null);
			setLoading(true);
			const res = await signIn('credentials', {
				callbackUrl,
				username: formData.get('email'),
				password: formData.get('password'),
			});
			if (res?.error) setError(t('invalidCredentials'));
		} catch (error) {
			setError(`${t('errorPrefix')} ${error}`);
		} finally {
			setTimeout(() => setLoading(false), 1000);
		}
	};

	useEffect(() => {
		const error = new URLSearchParams(window.location.search).get('error');
		if (error === 'CredentialsSignin') setError(t('invalidCredentials'));
	}, []);

	return (
		<div className={cn('structured', 'grid')}>
			<form className={s.form} method='POST' onSubmit={handleSignin}>
				<input id='email' name='email' type='email' placeholder={t('email')} autoComplete='username' />
				<input name='password' type='password' placeholder={t('password')} autoComplete='current-password' />
				<button type='submit' disabled={loading}>
					{loading ? t('loggingIn') : t('loginButton')}
				</button>
			</form>
			{error && <p className={s.error}>{error}</p>}
		</div>
	);
}
