import s from './page.module.scss';
import Article from '@/components/layout/Article';
import { getSession } from '@/lib/auth';
import { apiQuery } from 'next-dato-utils/api';

export default async function AllCourses() {
	const session = await getSession();

	return <Article title='Medlem'>Medlem</Article>;
}
