
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function Profile() {
	const { user } = useUser();
	if (!user) return null;
	return (
		<div>
			<h2>Welcome, {user.firstName} {user.lastName}</h2>
			<p>Email: {user.primaryEmailAddress.emailAddress}</p>
			<p>Role: {user.privateMetadata?.role || 'user'}</p>
			<UserButton />
		</div>
	);
}


function Login() {
	return (
		<ClerkProvider publishableKey={clerkPubKey}>
			<SignedIn>
				<Profile />
			</SignedIn>
			<SignedOut>
				<SignIn />
			</SignedOut>
		</ClerkProvider>
	);
}

export default Login;
