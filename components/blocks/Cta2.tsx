import s from './Cta2.module.scss';
import Content from '@/components/common/Content';
import cn from 'classnames';

export type CTAProps = {
	data: CtaRecord;
};

export default function Cta2({ data: { text } }: CTAProps) {
	return <section className={cn(s.cta)}>{text && <Content content={text} />}</section>;
}
