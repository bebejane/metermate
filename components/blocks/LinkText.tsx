import Link from 'next/link';

export type LinkTextProps = {
	data: LinkTextRecord;
};

export default function LinkText({ data }: LinkTextProps) {
	const { text, url } = data;
	return (
		<Link href={url} target='_blank' rel='noopener noreferrer'>
			{text}
		</Link>
	);
}
