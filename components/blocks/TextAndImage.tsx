import s from './TextAndImage.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';

export type TextAndImageProps = {
	data: TextAndImageRecord;
};

export default function TextAndImage({ data: { media, content, layout, color } }: TextAndImageProps) {
	return (
		<section className={cn(s.textandimage, s[layout], s[color])}>
			<div className={s.text}>
				<Content content={content} />
			</div>
			<figure>{media[0]?.responsiveImage && <Image data={media[0].responsiveImage} />}</figure>
		</section>
	);
}
