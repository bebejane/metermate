import s from './Image.module.scss';
import { Image as DatoImage } from 'react-datocms';

export type ImageProps = { data: ImageRecord };

export default function Image({ data: { image } }: ImageProps) {
	return (
		<figure className={s.figure}>
			{image.responsiveImage && <DatoImage data={image.responsiveImage} imgClassName={s.image} />}
			<figcaption>{image.responsiveImage.title}</figcaption>
		</figure>
	);
}
