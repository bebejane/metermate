'use client';

import s from './Column.module.scss';
import cn from 'classnames';
import Content from '@/components/content/Content';
import { Image, stripStega } from 'react-datocms';

export type ColumnProps = {
	column: ColumnRecord;
};

export default function Column({ column: { image, text, color } }: ColumnProps) {
	return (
		<div className={cn(s.column, s[stripStega(color)])} data-datocms-content-link-boundary>
			<div className={cn(s.text)}>
				<Content content={text} className={s.content} />
			</div>
			{image?.responsiveImage && (
				<figure>
					<Image data={image.responsiveImage} />
				</figure>
			)}
		</div>
	);
}
