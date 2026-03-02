'use client';

import s from './TextAndImage.module.scss';
import cn from 'classnames';
import Content from '@/components/content/Content';
import { Image, stripStega } from 'react-datocms';

export type TextAndImageProps = {
	data: TextAndImageRecord;
};

export default function TextAndImage({
	data: { media, content, layout, color },
}: TextAndImageProps) {
	return (
		<section className={cn(s.textandimage, s[stripStega(layout)], s[stripStega(color)])}>
			<div className={s.text}>
				<Content content={content} />
			</div>
			<figure>{media[0]?.responsiveImage && <Image data={media[0].responsiveImage} />}</figure>
		</section>
	);
}
