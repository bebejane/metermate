import s from './Column.module.scss';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';

export type ColumnProps = {
	column: ColumnRecord;
};

export default function Column({ column }: ColumnProps) {
	return (
		<div className={s.column}>
			<figure>{column.image && <Image data={column.image.responsiveImage} />}</figure>
			<div className={s.text}>
				<Content content={column.text} className={s.text} />
			</div>
		</div>
	);
}
