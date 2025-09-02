import s from './ToggleText.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';

export type ToggleTextProps = {
	data: ToggleTextRecord;
};

export default function ToggleText({ data: { headline, text } }: ToggleTextProps) {
	return (
		<section className={s.toggletext}>
			<h3>{headline}</h3>
			<Content content={text} />
		</section>
	);
}
