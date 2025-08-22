import { Link } from '@/i18n/routing';
import Content from '@/components/common/Content';
import s from './Shortcut.module.scss';
import cn from 'classnames';

export type ShortcutProps = {
	shortcut: ShortcutRecord;
	locale: SiteLocale;
};

export default function Shortcut({ shortcut, locale }: ShortcutProps) {
	const linkType = shortcut.link.__typename;
	const href =
		linkType === 'AboutRecord'
			? '/om'
			: linkType === 'ProductRecord'
				? '/produkter'
				: linkType === 'SupportStartRecord'
					? '/support'
					: linkType === 'PartnerRecord'
						? '/partners'
						: linkType === 'ReferenceRecord'
							? '/referenser'
							: null;

	if (!href) return null;

	return (
		<Link href={href} locale={locale} className={cn(s.shortcut, s[shortcut.color])}>
			<Content content={shortcut.text} className={s.text} />
		</Link>
	);
}
