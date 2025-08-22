import CredentialsProvider from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth/next';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
		maxAge: 365 * (24 * 60 * 60), // 365 days
	},
	pages: {
		signIn: '/logga-in',
		signOut: '/logga-ut',
	},
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			return true;
		},
		async jwt({ token, user }) {
			return token;
		},
		session({ session, token }) {
			return session;
		},
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					const { username: email, password } = credentials;

					if (password !== process.env.NEXTAUTH_URL_STATIC_PASSWORD) return null;

					const session = {
						id: 'user',
						email: email as string,
						image: null,
					};
					return session;
				} catch (err) {
					console.error(err);
					return null;
				}
			},
		}),
	],
};

export const getSession = async () => {
	const session = await getServerSession(authOptions);
	if (!session?.user) throw new Error('Unauthorized');
	return session;
};
