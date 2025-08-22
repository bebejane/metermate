import s from './Button.module.scss';
import cn from 'classnames';
import Link from 'next/link';

type Props = {
	data: ButtonRecord;
};

export default function Button({ data: { text, url } }: Props) {
	return (
		<p className={s.wrapper}>
			<Link href={url} className={s.button}>
				<button className={s.button}>{text}</button>
			</Link>
		</p>
	);
}
