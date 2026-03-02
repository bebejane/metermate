import s from './TwoColumn.module.scss';
import Column from '@/components/content/blocks/Column';

export type TwoColumnProps = {
	data: TwoColumnRecord;
};

export default function TwoColumn({ data: { columns } }: TwoColumnProps) {
	return (
		<section className={s.twocolumn} data-datocms-content-link-group>
			{columns?.map((column, idx) => <Column key={idx} column={column} />)}
		</section>
	);
}
