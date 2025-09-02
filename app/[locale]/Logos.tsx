import s from './Logos.module.scss';
import cn from 'classnames';

export type LogosProps = {
	logos: StartQuery['start']['logos'];
};

export default function Logos({ logos }: LogosProps) {
	return (
		<section className={s.logos}>
			<div className={s.wrapper}>
				<div className={s.images}>
					{logos.map(({ url, alt }) => (
						<img key={url} src={url} alt={alt} />
					))}
				</div>
				<div className={s.images}>
					{logos.map(({ url, alt }) => (
						<img key={url} src={url} alt={alt} />
					))}
				</div>
				<div className={s.images}>
					{logos.map(({ url, alt }) => (
						<img key={url} src={url} alt={alt} />
					))}
				</div>
			</div>
		</section>
	);
}
