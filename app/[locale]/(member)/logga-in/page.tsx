'use server';

import s from './page.module.scss';
import Article from '@/components/layout/Article';
import LoginForm from './LoginForm';
import { Metadata } from 'next';

export default async function Login() {
	return (
		<Article>
			<h1>Logga in</h1>
			<div className={s.form}>
				<LoginForm />
			</div>
		</Article>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Logga in',
	} as Metadata;
}
