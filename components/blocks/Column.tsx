import s from './Column.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';

export type ColumnProps = {
	column: ColumnRecord;
};

export default function Column({ column: { image, text, color } }: ColumnProps) {
	return (
		<div className={cn(s.column, s[color])}>
			<div className={cn(s.text)}>
				<Content content={text} className={s.text} />
			</div>
			{image?.responsiveImage && (
				<figure>
					<Image data={image.responsiveImage} />
				</figure>
			)}
		</div>
	);
}
