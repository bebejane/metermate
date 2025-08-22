import s from './page.module.scss';
import Article from '@/components/layout/Article';
import { getSession } from '@/lib/auth';
import { apiQuery } from 'next-dato-utils/api';
import { redirect } from 'next/navigation';

export default async function AllCourses() {
	try {
		await getSession();
	} catch (e) {
		return redirect('/logga-in');
	}

	return <Article title='Medlem'>Medlem</Article>;
}
