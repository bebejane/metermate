import s from './Cta.module.scss';
import Content from '@/components/common/Content';
import cn from 'classnames';

export type CTAProps = {
	data: CtaRecord;
};

export default function Cta({ data: { text } }: CTAProps) {
	return <section className={cn(s.cta)}>{text && <Content content={text} />}</section>;
}
