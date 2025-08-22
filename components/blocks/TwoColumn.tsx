import s from './TwoColumn.module.scss';
import Column from '@/components/blocks/Column';

export type TwoColumnProps = {
	data: TwoColumnRecord;
};

export default function TwoColumn({ data: { columns } }: TwoColumnProps) {
	return (
		<section className={s.twocolumn}>{columns?.map((column, idx) => <Column key={idx} column={column} />)}</section>
	);
}
