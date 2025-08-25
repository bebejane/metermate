'use server';

import s from './page.module.scss';
import Article from '@/components/layout/Article';
import LoginForm from './LoginForm';
import { Metadata } from 'next';

export default async function Login() {
	return (
		<Article>
			<div className={s.wrap}>
				<h1>Medlem</h1>
				<div className={s.form}>
					<LoginForm />
				</div>
			</div>
		</Article>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Logga in',
	} as Metadata;
}
