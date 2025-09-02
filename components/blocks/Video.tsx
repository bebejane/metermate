'use client';

import s from './Video.module.scss';
import { VideoPlayer } from 'next-dato-utils/components';

export type VideoProps = {
	data: VideoRecord;
};
export default function Video({ data }: VideoProps) {
	if (!data || !data.video) return null;

	return (
		<div className={s.wrap}>
			<VideoPlayer data={data.video} className={s.video} videoClassName={s.video} autoPlay={false} controls={true} />
			<figcaption>{data.caption}</figcaption>
		</div>
	);
}
