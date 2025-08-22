import s from './Column.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';

export type ColumnProps = {
	column: ColumnRecord;
};

export default function Column({ column }: ColumnProps) {
	return (
		<div className={cn(s.column, s[column.color])}>
			<figure>{column.image && <Image data={column.image.responsiveImage} />}</figure>
			<div className={s.text}>
				<Content content={column.text} className={s.text} />
			</div>
		</div>
	);
}
