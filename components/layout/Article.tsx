'use client';

import s from './Article.module.scss';
import cn from 'classnames';
import Content from '@/components/common/Content';

export type ArticleProps = {
	title?: string;
	intro?: any;
	content?: any;
	markdown?: boolean;
	link?: {
		href: string;
		text: string;
	};
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
};

export default function Article({ title, intro, content, link, className, children }: ArticleProps) {
	return (
		<article className={cn(s.article, className)}>
			{title && (
				<header>
					{title && <h1>{title}</h1>}
					{intro && <Content content={intro} className={s.intro} />}
				</header>
			)}
			{content && <Content content={content} className={s.content} />}
			{children}
		</article>
	);
}
