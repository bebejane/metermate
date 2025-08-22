import s from './Column.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';

export type ColumnProps = {
	column: ColumnRecord;
};

export default function Column({ column }: ColumnProps) {
	return (
		<div className={cn(s.column)}>
			{column.image && (
				<figure>
					<Image data={column.image.responsiveImage} />
				</figure>
			)}
			<div className={cn(s.text, s[column.color])}>
				<Content content={column.text} className={s.text} />
			</div>
		</div>
	);
}
