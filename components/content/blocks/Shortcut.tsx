import s from './Shortcut.module.scss';
import cn from 'classnames';
import { Link } from '@/i18n/routing';
import Content from '@/components/content/Content';
import { stripStega } from '@datocms/content-link';

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
		<Link
			href={href}
			locale={locale}
			className={cn(s.shortcut, s[stripStega(shortcut.color)])}
			data-datocms-content-link-boundary
		>
			<Content content={shortcut.text} className={s.text} />
		</Link>
	);
}
